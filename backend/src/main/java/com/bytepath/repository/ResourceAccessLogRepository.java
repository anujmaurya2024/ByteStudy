package com.bytepath.repository;

import com.bytepath.model.ResourceAccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceAccessLogRepository extends JpaRepository<ResourceAccessLog, Long> {
    void deleteByResource(com.bytepath.model.PyqResource resource);
}
