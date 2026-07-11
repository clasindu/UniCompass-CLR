package com.academiccompass.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "semester_id", nullable = false)
    private UUID semesterId;

    @Column(nullable = false)
    private String name;

    @Column(name = "credit_hours", nullable = false)
    private Integer creditHours = 3;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSemesterId() { return semesterId; }
    public void setSemesterId(UUID semesterId) { this.semesterId = semesterId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getCreditHours() { return creditHours; }
    public void setCreditHours(Integer creditHours) { this.creditHours = creditHours; }
}
