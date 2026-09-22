package com.bytepath.repository;
import com.bytepath.model.AccountToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AccountTokenRepository extends JpaRepository<AccountToken,Long> { Optional<AccountToken> findByTokenHash(String hash); }
