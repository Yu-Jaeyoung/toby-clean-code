package io.wisoft.splearn.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EmailTest {
    @Test
    void equality() {
        var email1 = new Email("jaeyoung@wisoft.io");
        var email2 = new Email("jaeyoung@wisoft.io");

        assertThat(email1).isEqualTo(email2);
    }

}