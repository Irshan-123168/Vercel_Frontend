package com.attendflow.backend.controller;

import com.attendflow.backend.model.User;
import com.attendflow.backend.model.Student;
import com.attendflow.backend.repository.UserRepository;
import com.attendflow.backend.repository.StudentRepository;
import com.attendflow.backend.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        User savedUser = userRepository.save(user);

        // If it's a student, create a student record in the registry
        if ("STUDENT".equals(user.getRole())) {
            // Create student entry in the registry
            Student student = new Student();
            student.setName(user.getUsername());
            student.setRoll(user.getRollNumber());
            student.setParentPhoneNumber(user.getPhoneNumber());
            student.setStatus("Unknown");
            student.setTime("-");
            student.setBranch("");
            student.setSemester("");
            student.setSubject("");
            studentRepository.save(student);
        }

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        String identifier = loginRequest.getEmail(); // frontend sends username or email in the 'email' field
        Optional<User> userOpt = userRepository.findByEmail(identifier);
        
        if (!userOpt.isPresent()) {
            userOpt = userRepository.findByUsername(identifier);
        }

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                String subject = "Access Key Recovery - Sanjay Gandhi Polytechnic";
                String body = "Dear " + user.getUsername() + ",\n\n" +
                        "A request has been initiated to recover your access key for the AttendanceFlow Portal.\n\n" +
                        "Your Access Key is: " + user.getPassword() + "\n\n" +
                        "If you did not initiate this request, please contact the IT department immediately.\n\n" +
                        "Regards,\n" +
                        "SGPB Admin Core";

                emailService.sendEmail(email, subject, body);
                return ResponseEntity.ok().body(java.util.Map.of("message", "Access Key sent to " + email));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
            }
        }
        return ResponseEntity.status(404).body("Error: Identity not found in institutional registry.");
    }

    @PostMapping("/forgot-username")
    public ResponseEntity<?> forgotUsername(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                String subject = "Username Recovery - Sanjay Gandhi Polytechnic";
                String body = "Dear Student/Staff,\n\n" +
                        "A request has been initiated to recover your username for the AttendanceFlow Portal.\n\n" +
                        "Your Registered Username is: " + user.getUsername() + "\n\n" +
                        "If you did not initiate this request, please contact the IT department immediately.\n\n" +
                        "Regards,\n" +
                        "SGPB Admin Core";

                emailService.sendEmail(email, subject, body);
                return ResponseEntity.ok().body(java.util.Map.of("message", "Username sent to " + email));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
            }
        }
        return ResponseEntity.status(404).body("Error: Email address not found in institutional registry.");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body("User ID is required");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User userToRemove = userOpt.get();
            userRepository.delete(userToRemove);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Account deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/update-password/{id}")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        if (id == null || oldPassword == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("User ID, old password, and new password are required");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.getPassword().equals(oldPassword)) {
                return ResponseEntity.status(401).body("Invalid old access key");
            }
            user.setPassword(newPassword);
            userRepository.save(user);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Access key updated successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
