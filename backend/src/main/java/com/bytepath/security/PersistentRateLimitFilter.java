package com.bytepath.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.jdbc.core.JdbcTemplate; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException; import java.time.Instant;
@Component
public class PersistentRateLimitFilter extends OncePerRequestFilter {
 private final JdbcTemplate jdbc;
 public PersistentRateLimitFilter(JdbcTemplate jdbc){this.jdbc=jdbc;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws IOException,ServletException{
  String p=req.getRequestURI(); if(p.startsWith("/api/auth/") || p.equals("/api/payments/razorpay/order")){
   String key=p+":"+(req.getRemoteAddr()==null?"unknown":req.getRemoteAddr()); long bucket=Instant.now().getEpochSecond()/60;
   int count=jdbc.queryForObject("INSERT INTO api_rate_limits(rate_key,bucket,count) VALUES (?, ?, 1) ON CONFLICT(rate_key,bucket) DO UPDATE SET count=api_rate_limits.count+1 RETURNING count",Integer.class,key,bucket);
   if(count>20){res.setStatus(429);res.setHeader("Retry-After","60");return;}
  } chain.doFilter(req,res);
 }
}
