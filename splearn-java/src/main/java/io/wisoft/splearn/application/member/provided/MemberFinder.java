package io.wisoft.splearn.application.member.provided;

import io.wisoft.splearn.domain.member.Member;

/**
 * 회원을 조회한다
 */
public interface MemberFinder {
    Member find(Long memberId);
}
