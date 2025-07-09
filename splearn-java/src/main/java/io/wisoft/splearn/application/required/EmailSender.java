package io.wisoft.splearn.application.required;

import io.wisoft.splearn.domain.Email;

/**
 * 이메일을 발송한다
 */
public interface EmailSender {
    void send(Email email, String subject, String body);
}
