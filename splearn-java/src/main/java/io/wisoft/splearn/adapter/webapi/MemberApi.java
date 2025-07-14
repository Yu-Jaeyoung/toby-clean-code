package io.wisoft.splearn.adapter.webapi;

import io.wisoft.splearn.adapter.webapi.dto.MemberRegisterResponse;
import io.wisoft.splearn.application.member.provided.MemberRegister;
import io.wisoft.splearn.domain.member.Member;
import io.wisoft.splearn.domain.member.MemberRegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberApi {
    private final MemberRegister memberRegister;

    @PostMapping("/api/members")
    public MemberRegisterResponse register(@RequestBody @Valid MemberRegisterRequest request) {
        Member member = memberRegister.register(request);

        return MemberRegisterResponse.of(member);
    }
}
