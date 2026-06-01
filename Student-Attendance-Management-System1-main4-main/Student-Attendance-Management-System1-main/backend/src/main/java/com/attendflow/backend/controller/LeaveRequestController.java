package com.attendflow.backend.controller;

import com.attendflow.backend.model.LeaveRequest;
import com.attendflow.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @GetMapping
    public List<LeaveRequest> getAllRequests() {
        return leaveRequestRepository.findAll();
    }

    @GetMapping("/faculty/{facultyId}")
    public List<LeaveRequest> getRequestsByFaculty(@PathVariable Long facultyId) {
        return leaveRequestRepository.findByFacultyId(facultyId);
    }

    @PostMapping
    public LeaveRequest createRequest(@RequestBody LeaveRequest request) {
        request.setStatus("Pending");
        return leaveRequestRepository.save(request);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> statusUpdate) {
        return leaveRequestRepository.findById(id)
                .map(request -> {
                    request.setStatus(statusUpdate.get("status"));
                    return ResponseEntity.ok(leaveRequestRepository.save(request));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
