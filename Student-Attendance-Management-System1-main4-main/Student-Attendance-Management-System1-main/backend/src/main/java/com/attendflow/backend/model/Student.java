package com.attendflow.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String roll;
    private String studentClass;
    private String branch;
    private String semester;
    private String subject;
    private String status;
    private String time;
    private String parentPhoneNumber;
    private int presentCount = 0;
    private int absentCount = 0;
}
