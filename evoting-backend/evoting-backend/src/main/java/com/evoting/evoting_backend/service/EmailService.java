package com.evoting.evoting_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVoteConfirmation(String toEmail, String voterName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Vote Confirmation");
        message.setText("Hello " + voterName + ",\n\nYour vote has been successfully cast.\n\nThank you for participating!");

        mailSender.send(message);
    }
}
