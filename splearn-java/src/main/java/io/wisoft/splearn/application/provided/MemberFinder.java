package io.wisoft.splearn.application.provided;

import io.wisoft.splearn.domain.Member;

/**
 * 회원을 조회한다
 */
public interface MemberFinder {
    Member find(Long memberId);
}
