package com.bytepath.data;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Complete B.Tech CS & IT Syllabus — 8 Semesters, 196 Total Credits.
 * <p>
 * This is a direct Java port of the original {@code syllabus.js} data file.
 * Stored as a static constant so no database table is needed for curriculum data.
 */
public final class SyllabusData {

    private SyllabusData() {}

    public static final int TOTAL_PROGRAM_CREDITS = 196;

    // ── Course record ──────────────────────────────────────────────────────────

    public record Course(String code, String title, int credits, String type) {}

    public record Semester(int semester, int totalCredits, List<Course> courses) {}

    // ── Full 8-semester curriculum ─────────────────────────────────────────────

    public static final List<Semester> SYLLABUS = List.of(

        new Semester(1, 26, List.of(
            new Course("SET/SH/BT/C101", "Mathematics I", 4, "Basic"),
            new Course("SET/SH/BT/C103", "Chemistry", 4, "Science"),
            new Course("SET/ME/BT/C104", "Engineering Mechanics", 4, "Core Basic"),
            new Course("SET/ME/BT/C102", "Basic Mechanical Engineering", 4, "Engineering"),
            new Course("SET/CS/BT/C105", "C Programming", 4, "Core"),
            new Course("SET/SH/BT/C108", "Chemistry Lab", 1, "Lab"),
            new Course("SET/CS/BT/C109", "C Programming Lab", 1, "Lab"),
            new Course("VAC-1", "Understanding and Connecting Student with Environment", 2, "VAC"),
            new Course("SET/CS/SC/C110", "Internet Technology Lab-I (Skill Enhancement Course)", 2, "Skill")
        )),

        new Semester(2, 26, List.of(
            new Course("SET/SH/BT/C201", "Mathematics II", 4, "Basic"),
            new Course("SET/SH/BT/C202", "Physics", 4, "Science"),
            new Course("SET/EE/BT/C203", "Basic Electrical Engineering", 4, "Core Basic"),
            new Course("SET/EC/BT/C204", "Basic Electronics", 4, "Core Basic"),
            new Course("SET/IT/BT/C205", "Fundamental of Information Technology", 4, "Core"),
            new Course("SET/SH/BT/C207", "Physics Lab", 1, "Lab"),
            new Course("SET/ME/BT/C208", "Engineering Graphics and Workshop Practice", 2, "Lab"),
            new Course("VAC-2", "Life Skills and Personality Development", 2, "VAC"),
            new Course("SET/CS/SC/C210", "Internet Technology Lab-II / Basics of Python Lab", 2, "Skill")
        )),

        new Semester(3, 26, List.of(
            new Course("SET/AH/BT/C301", "Mathematics III", 4, "Science"),
            new Course("SET/CS/BT/C302", "Computer Based Numerical & Statistical Techniques", 4, "Core"),
            new Course("SET/CS/BT/C304", "Data Structures Using C", 4, "Core"),
            new Course("SET/CS/BT/C305", "Discrete Structures", 4, "Core"),
            new Course("SET/EC/BT/C303", "Digital Electronics", 4, "Interdisciplinary"),
            new Course("SET/CS/BT/C306", "Computer Based Numerical & Statistical Techniques Lab", 1, "Lab"),
            new Course("SET/CS/BT/C307", "Digital Electronics Lab", 1, "Lab"),
            new Course("AMDSC-2", "Additional Multidisciplinary Skill Course", 2, "Extracurricular"),
            new Course("SET/CS/SC/C308", "Data Structures Using C Lab", 2, "Skill")
        )),

        new Semester(4, 26, List.of(
            new Course("SET/CS/BT/C401", "Object Oriented Programming using C++", 4, "Core"),
            new Course("SET/CS/BT/C402", "Operating System", 4, "Core"),
            new Course("SET/CS/BT/C403", "Computer Organization and Architecture", 4, "Core"),
            new Course("SET/CS/BT/C405", "Theory of Computation", 4, "Core"),
            new Course("SET/CS/BT/C404", "Data Communication and Computer Network", 4, "Interdisciplinary"),
            new Course("SET/CS/BT/C406", "Object Oriented Programming using C++ Lab", 1, "Lab"),
            new Course("SET/CS/BT/C407", "Operating System Lab", 1, "Lab"),
            new Course("VAC-3", "Indian Knowledge System", 2, "IKS"),
            new Course("SET/CS/SC/C408", "Mini Project (Based on C/C++)", 2, "Skill")
        )),

        new Semester(5, 26, List.of(
            new Course("SET/CS/BT/C501", "Database Management System", 4, "Core"),
            new Course("SET/CS/BT/C502", "Design and Analysis of Algorithms", 4, "Core"),
            new Course("SET/CS/BT/C503", "Software Engineering", 4, "Core"),
            new Course("SET/CS/BT/E501", "Program Elective-1 (Distributed Computing / Graph Theory / Prog Languages)", 4, "Elective"),
            new Course("SET/CS/BT/OE501", "Open Elective-1 (Java Programming / Project Mgmt / Optimization)", 4, "Open Elective"),
            new Course("SET/CS/BT/C504", "Database Management System Lab", 1, "Lab"),
            new Course("SET/CS/BT/C505", "Design and Analysis of Algorithms Lab", 1, "Lab"),
            new Course("SET/CS/BT/M506", "Culture, Traditions and Moral Values / Yoga Practices", 2, "Compulsory"),
            new Course("SET/CS/SC/C507", "Python Lab", 2, "Skill")
        )),

        new Semester(6, 26, List.of(
            new Course("SET/CS/BT/C601", "Compiler Design", 4, "Core"),
            new Course("SET/CS/BT/C602", "Computer Graphics", 4, "Core"),
            new Course("SET/CS/BT/C603", "Cryptography and Network Security", 4, "Core"),
            new Course("SET/CS/BT/E601", "Program Elective-2 (Data Mining / E-Commerce / Data Science)", 4, "Elective"),
            new Course("SET/CS/BT/OE602", "Open Elective-2: Web Technology", 4, "Open Elective"),
            new Course("SET/CS/BT/C604", "Compiler Designing Lab", 1, "Lab"),
            new Course("SET/CS/BT/C605", "Computer Graphics Lab", 1, "Lab"),
            new Course("SET/CS/BT/M606", "Communication Skill Course / Technical Seminar", 2, "Soft Skills"),
            new Course("SET/CS/SC/C607", "Mini Project", 2, "Skill")
        )),

        new Semester(7, 20, List.of(
            new Course("SET/CS/BT/C701", "Artificial Intelligence", 4, "Core"),
            new Course("SET/CS/BT/E701", "Program Elective-3 (Wireless Computing / Security Arch / Neural Network)", 4, "Elective"),
            new Course("SET/CS/BT/E704", "Program Elective-4 (Real Time System / Cloud Computing / Computer Vision)", 4, "Elective"),
            new Course("SET/CS/BT/C702", "Artificial Intelligence Lab", 1, "Lab"),
            new Course("SET/CS/BT/S703", "Industrial Training Seminar", 1, "Lab"),
            new Course("Management", "Essential Management Practices", 2, "Life Skills"),
            new Course("SET/CS/SC/C704", "Project Stage-1", 4, "Skill")
        )),

        new Semester(8, 20, List.of(
            new Course("SET/CS/BT/C801", "UNIX Shell Programming", 4, "Core"),
            new Course("SET/CS/BT/E801", "Program Elective-5 (NLP / IoT / Machine Learning / Big Data)", 4, "Elective"),
            new Course("SET/CS/BT/E805", "Program Elective-6 (Cyber Security / Mobile App Dev / Blockchain / Deep Learning)", 4, "Elective"),
            new Course("SET/CS/BT/L802", "Disaster Management", 2, "Life Skills"),
            new Course("SET/CS/SC/C803", "Project and Dissertation", 6, "Skill")
        ))
    );

    // ── Career insights map (phase → advice) ──────────────────────────────────

    public record CareerInsight(String headline, String body, String actionLabel, String action) {}

    public record CareerPhaseInfo(
        String phase, String icon, String title, List<CareerInsight> insights) {}

    public static final Map<String, CareerPhaseInfo> CAREER_INSIGHTS = new LinkedHashMap<>();

    static {
        CAREER_INSIGHTS.put("1-2", new CareerPhaseInfo(
            "Foundation Phase", "🧱", "Build Your JavaScript Foundation",
            List.of(
                new CareerInsight(
                    "C → JavaScript Bridge",
                    "Your C Programming logic maps directly to JavaScript's core. Start with vanilla JS: master DOM manipulation, event listeners, and async/await.",
                    "Start Now",
                    "Practice LeetCode Easy problems in JavaScript, mirroring the C solutions you write in class."
                ),
                new CareerInsight(
                    "HTML + CSS Fundamentals",
                    "While studying Engineering Mechanics and Math, spend 30 min/day on HTML semantics and CSS Flexbox/Grid.",
                    "Resource",
                    "freeCodeCamp.org — Responsive Web Design Certification (300 hours, free)."
                ),
                new CareerInsight(
                    "Internet Technology Lab",
                    "Your Internet Technology Lab-I & II courses are golden — leverage them fully. Build static web pages.",
                    "Project Idea",
                    "Build a static GPA calculator web page using HTML + CSS + vanilla JavaScript."
                )
            )
        ));

        CAREER_INSIGHTS.put("3-4", new CareerPhaseInfo(
            "Core Engineering Phase", "⚙️", "OOP → React Component Architecture",
            List.of(
                new CareerInsight(
                    "C++ OOP → React Components",
                    "OOP using C++ introduces classes, inheritance, polymorphism, and encapsulation. In React, every component IS a class-like entity.",
                    "Map It",
                    "Classes → React Components | Methods → Custom Hooks | Inheritance → Component Composition."
                ),
                new CareerInsight(
                    "Data Structures → React State",
                    "Data Structures Using C teaches Arrays, Trees, Graphs. React state management (useState, useReducer) leverages these exact patterns.",
                    "Project",
                    "Build a React todo app with a binary search tree-powered search feature."
                ),
                new CareerInsight(
                    "Operating Systems → Node.js",
                    "OS concepts — processes, threads, IPC — are fundamental to understanding Node.js's event loop and non-blocking I/O architecture.",
                    "Next Step",
                    "Start learning Node.js basics and npm. Create a simple Express.js REST API server."
                ),
                new CareerInsight(
                    "Networks → API Architecture",
                    "Computer Networks gives you HTTP, TCP/IP, DNS understanding. This is precisely how REST APIs and WebSockets operate.",
                    "Skill",
                    "Learn Postman and practice calling public REST APIs (OpenWeather, GitHub API)."
                )
            )
        ));

        CAREER_INSIGHTS.put("5-6", new CareerPhaseInfo(
            "Full-Stack Launch Phase", "🚀", "Full-Stack MERN Developer Mode",
            List.of(
                new CareerInsight(
                    "Web Technology (OE602) — CRITICAL MILESTONE",
                    "Web Technology in Semester VI is your formal introduction to frontend frameworks, server-side rendering, and web protocols. Treat it as your core subject.",
                    "Priority",
                    "Make this your highest-effort course. Align your mini-project with a full-stack web application."
                ),
                new CareerInsight(
                    "DBMS → MongoDB + SQL Mastery",
                    "DBMS teaches relational algebra, normalization, SQL. Bridge this to MongoDB's document model.",
                    "Project",
                    "Build a full-stack inventory system: React + Express + MongoDB + SQL schema comparison."
                ),
                new CareerInsight(
                    "Software Engineering → Agile Git Workflow",
                    "Software Engineering covers SDLC, Agile, testing. Implement Git branching strategies, write unit tests with Jest.",
                    "Essential",
                    "Every project should have: Git repo + README + deployment on Vercel/Netlify."
                ),
                new CareerInsight(
                    "Cryptography → Auth & Security",
                    "Cryptography is directly applicable to JWT authentication, HTTPS, OAuth2, and bcrypt password hashing.",
                    "Implement",
                    "Add JWT-based authentication to your MERN apps. Implement bcrypt for password storage."
                )
            )
        ));

        CAREER_INSIGHTS.put("7-8", new CareerPhaseInfo(
            "Advanced Specialization Phase", "🌐", "Cloud, AI & Enterprise Architecture",
            List.of(
                new CareerInsight(
                    "AI (C701) → ML-Powered Web APIs",
                    "Artificial Intelligence + ML electives give you the foundation to integrate TensorFlow.js, OpenAI API into your web applications.",
                    "Build",
                    "Create a web app with an AI chatbot using OpenAI API + React + Node.js backend."
                ),
                new CareerInsight(
                    "Cloud Computing Elective → DevOps",
                    "Cloud Computing connects directly to AWS EC2, S3, Lambda, Docker containerization, and Kubernetes orchestration.",
                    "Deploy Now",
                    "Dockerize your MERN application. Deploy to AWS ECS or use Vercel + Railway for managed hosting."
                ),
                new CareerInsight(
                    "UNIX Shell (C801) → Linux Server Mastery",
                    "UNIX Shell Programming is essential for server administration, writing deployment scripts, and CI/CD automation.",
                    "Practice",
                    "Write bash scripts to automate your project deployments. Set up a Linux VPS on DigitalOcean."
                ),
                new CareerInsight(
                    "Project & Dissertation → Portfolio Flagship",
                    "Your final project is your most visible portfolio piece. Choose a full-stack web system with ML integration.",
                    "Framework",
                    "Next.js 14 + tRPC + Prisma + PostgreSQL + Docker + AWS + AI feature = Dream job ready."
                )
            )
        ));
    }

    /** Resolve semester number → career phase string ("1-2", "3-4", "5-6", "7-8"). */
    public static String careerPhaseFor(int semesterNumber) {
        if (semesterNumber <= 2) return "1-2";
        if (semesterNumber <= 4) return "3-4";
        if (semesterNumber <= 6) return "5-6";
        return "7-8";
    }
}
