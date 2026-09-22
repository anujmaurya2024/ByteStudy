package com.bytepath.repository;

import com.bytepath.model.ChatMessage;
import com.bytepath.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserOrderBySentAtAsc(User user);
    void deleteByUser(User user);
}
