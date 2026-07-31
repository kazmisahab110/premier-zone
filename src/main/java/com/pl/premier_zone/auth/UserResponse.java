package com.pl.premier_zone.auth;

public class UserResponse {

    private Long id;
    private String displayName;
    private String email;
    private String role;

    public UserResponse() {
    }

    public UserResponse(Long id, String displayName, String email, String role) {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setName(String name) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}