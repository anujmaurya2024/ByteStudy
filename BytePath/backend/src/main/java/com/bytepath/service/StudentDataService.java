package com.bytepath.service;

import com.bytepath.model.*;
import com.bytepath.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Generic CRUD services for Deadlines, Expenses, Focus Sessions,
 * Simulated Grades, and PYQ Resources.
 */
@Service
public class StudentDataService {

    private final DeadlineRepository      deadlineRepo;
    private final ExpenseRepository       expenseRepo;
    private final FocusSessionRepository  focusRepo;
    private final SimulatedGradeRepository simGradeRepo;
    private final PyqResourceRepository   pyqRepo;

    public StudentDataService(
            DeadlineRepository deadlineRepo,
            ExpenseRepository expenseRepo,
            FocusSessionRepository focusRepo,
            SimulatedGradeRepository simGradeRepo,
            PyqResourceRepository pyqRepo) {
        this.deadlineRepo  = deadlineRepo;
        this.expenseRepo   = expenseRepo;
        this.focusRepo     = focusRepo;
        this.simGradeRepo  = simGradeRepo;
        this.pyqRepo       = pyqRepo;
    }

    // ── Deadlines ──────────────────────────────────────────────────────────────

    public List<Deadline> getDeadlines(User user) {
        return deadlineRepo.findByUserOrderByDueDateAsc(user);
    }

    @Transactional
    public Deadline createDeadline(User user, Deadline d) {
        d.setUser(user);
        return deadlineRepo.save(d);
    }

    @Transactional
    public Deadline updateDeadline(User user, Long id, Deadline updated) {
        Deadline existing = deadlineRepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Deadline not found: " + id));
        assertOwner(user, existing.getUser());
        existing.setTitle(updated.getTitle());
        existing.setDueDate(updated.getDueDate());
        existing.setCategory(updated.getCategory());
        existing.setPriority(updated.getPriority());
        existing.setStatus(updated.getStatus());
        return deadlineRepo.save(existing);
    }

    @Transactional
    public void deleteDeadline(User user, Long id) {
        Deadline d = deadlineRepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Deadline not found: " + id));
        assertOwner(user, d.getUser());
        deadlineRepo.delete(d);
    }

    // ── Expenses ───────────────────────────────────────────────────────────────

    public List<Expense> getExpenses(User user) {
        return expenseRepo.findByUserOrderByDateDesc(user);
    }

    @Transactional
    public Expense createExpense(User user, Expense e) {
        e.setUser(user);
        return expenseRepo.save(e);
    }

    @Transactional
    public Expense updateExpense(User user, Long id, Expense updated) {
        Expense existing = expenseRepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Expense not found: " + id));
        assertOwner(user, existing.getUser());
        existing.setAmount(updated.getAmount());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        existing.setDate(updated.getDate());
        return expenseRepo.save(existing);
    }

    @Transactional
    public void deleteExpense(User user, Long id) {
        Expense e = expenseRepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Expense not found: " + id));
        assertOwner(user, e.getUser());
        expenseRepo.delete(e);
    }

    // ── Focus Sessions ─────────────────────────────────────────────────────────

    public List<FocusSession> getFocusSessions(User user) {
        return focusRepo.findByUserOrderByDateDescStartTimeDesc(user);
    }

    @Transactional
    public FocusSession createFocusSession(User user, FocusSession session) {
        session.setUser(user);
        return focusRepo.save(session);
    }

    @Transactional
    public void deleteFocusSession(User user, Long id) {
        FocusSession s = focusRepo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Focus session not found: " + id));
        assertOwner(user, s.getUser());
        focusRepo.delete(s);
    }

    // ── Simulated Grades ───────────────────────────────────────────────────────

    public List<SimulatedGrade> getSimulatedGrades(User user) {
        return simGradeRepo.findByUser(user);
    }

    @Transactional
    public SimulatedGrade setSimulatedGrade(User user, String courseCode, String grade) {
        SimulatedGrade sg = simGradeRepo.findByUserAndCourseCode(user, courseCode)
            .orElseGet(() -> SimulatedGrade.builder().user(user).courseCode(courseCode).build());
        sg.setGrade(grade);
        return simGradeRepo.save(sg);
    }

    @Transactional
    public void clearSimulatedGrades(User user) {
        simGradeRepo.deleteByUser(user);
    }

    // ── PYQ Resources (admin-managed) ──────────────────────────────────────────

    public List<PyqResource> getAllPyqs() {
        return pyqRepo.findAllByOrderByUploadedAtDesc();
    }

    public List<PyqResource> getPyqsBySemester(int semesterNumber) {
        return pyqRepo.findBySemesterNumber(semesterNumber);
    }

    @Transactional
    public PyqResource createPyq(PyqResource pyq) {
        return pyqRepo.save(pyq);
    }

    @Transactional
    public void deletePyq(Long id) {
        if (!pyqRepo.existsById(id)) {
            throw new NoSuchElementException("PYQ resource not found: " + id);
        }
        pyqRepo.deleteById(id);
    }

    // ── Helper ─────────────────────────────────────────────────────────────────

    private void assertOwner(User requester, User owner) {
        if (!requester.getId().equals(owner.getId())) {
            throw new SecurityException("Access denied: you do not own this resource.");
        }
    }
}
