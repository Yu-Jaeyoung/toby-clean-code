package io.wisoft.splearn.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MemberTest {
    @Test
    void createMember() {
        var member = new Member("jaeyoung@wisoft.io", "Jaeyoung", "#*Secret*#");

        assertThat(member.getStatus()).isEqualTo(MemberStatus.PENDING);
    }
}