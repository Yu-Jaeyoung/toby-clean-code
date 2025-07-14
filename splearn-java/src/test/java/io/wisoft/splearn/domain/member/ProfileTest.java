package io.wisoft.splearn.domain.member;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProfileTest {
    @Test
    void profile() {
        new Profile("jaeyoung");
        new Profile("jaeyoung721");
        new Profile("123456");
        new Profile("");
    }

    @Test
    void profileFail() {
        assertThatThrownBy(() -> new Profile("toolongtoolongtoolongtoolongtoolongtoolong")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Profile("A")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> new Profile("프로필")).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void url() {
        var profile = new Profile("jaeyoung");

        assertThat(profile.url()).isEqualTo("@jaeyoung");
    }
}