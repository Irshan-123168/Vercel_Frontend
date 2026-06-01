package com.attendflow.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leave_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long facultyId;
    private String facultyName;
    private String type;
    private String reason;
    private String status; // Pending, Approved, Rejected
    private String startDate;
    private Integer duration;
    private String appliedDate;
}
