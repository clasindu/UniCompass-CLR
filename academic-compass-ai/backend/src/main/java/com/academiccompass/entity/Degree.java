package com.academiccompass.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "degrees")
public class Degree {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String field;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getField() { return field; }
    public void setField(String field) { this.field = field; }
}
