package com.nullbase.personalAssist.modules.common;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.repository.UserRepository;
import com.nullbase.personalAssist.modules.skills.*;
import com.nullbase.personalAssist.modules.topics.*;
import com.nullbase.personalAssist.modules.subtopics.*;
import com.nullbase.personalAssist.modules.tasks.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubtopicRepository subtopicRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SkillService skillService;

    @Override
    public void run(String... args) throws Exception {
        seedData();
    }

    public void seedData() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            List<Skill> userSkills = skillRepository.findByUser(user);
            if (userSkills.isEmpty()) {
                seedSkillsForUser(user);
            }
        }
    }

    public void seedSkillsForUser(User user) {
        // Skill 1: Fullstack Java Development
        Skill skill1 = new Skill(
                user,
                "Fullstack Java Web Development",
                "Learn enterprise Java, Spring Boot, Spring Data JPA, Security, and deploy robust web systems.",
                SkillLevel.INTERMEDIATE,
                "Become a Senior Java Developer capable of architecting scalable applications.",
                SkillStatus.PUBLISHED
        );
        skill1 = skillRepository.save(skill1);

        // Skill 1 - Topic 1: Spring Boot Foundations
        Topic topic1_1 = new Topic(skill1, "Spring Boot Foundations", "Master core IOC container, DI concepts, and web request lifecycles.", 1);
        topic1_1 = topicRepository.save(topic1_1);

        // Skill 1 - Topic 1 - Subtopic 1: Dependency Injection & IOC
        Subtopic subtopic1_1_1 = new Subtopic(topic1_1, "Dependency Injection & IOC", "Understand how Spring manages object lifecycle and injects dependencies.", DifficultyLevel.EASY, 45, 1);
        subtopic1_1_1 = subtopicRepository.save(subtopic1_1_1);

        Task task1_1_1_1 = new Task(subtopic1_1_1, "Read Core Docs on IOC Container", "Study the official Spring Reference Manual on beans and application contexts.", TaskType.READING, TaskStatus.TODO, LocalDate.now());
        taskRepository.save(task1_1_1_1);

        Task task1_1_1_2 = new Task(subtopic1_1_1, "Write DI Playground CLI App", "Develop a simple command-line app showing constructor vs field injection.", TaskType.PRACTICE, TaskStatus.TODO, LocalDate.now());
        taskRepository.save(task1_1_1_2);

        // Skill 1 - Topic 1 - Subtopic 2: Spring Data JPA & Hibernate
        Subtopic subtopic1_1_2 = new Subtopic(topic1_1, "Spring Data JPA & Hibernate", "Learn mapping entities, relationships, and custom JPQL queries.", DifficultyLevel.MEDIUM, 90, 2);
        subtopic1_1_2.setCompleted(true); // Pre-complete this one for visual impact
        subtopic1_1_2 = subtopicRepository.save(subtopic1_1_2);

        Task task1_1_2_1 = new Task(subtopic1_1_2, "Implement @ManyToOne relationship", "Create a basic schema showing parent-child relationship with JPA cascade deletion.", TaskType.PRACTICE, TaskStatus.COMPLETED, LocalDate.now().minusDays(2));
        taskRepository.save(task1_1_2_1);

        // Skill 1 - Topic 2: Advanced Security & Scaling
        Topic topic1_2 = new Topic(skill1, "Advanced Security & Scaling", "Integrate industry-grade user access controls and optimize query performance.", 2);
        topic1_2 = topicRepository.save(topic1_2);

        // Skill 1 - Topic 2 - Subtopic 1: JWT & Custom Filters
        Subtopic subtopic1_2_1 = new Subtopic(topic1_2, "JWT & Custom Filters", "Build custom WebSecurityConfigurer and implement stateless token validation.", DifficultyLevel.HARD, 120, 1);
        subtopic1_2_1 = subtopicRepository.save(subtopic1_2_1);

        Task task1_2_1_1 = new Task(subtopic1_2_1, "Implement JwtAuthFilter", "Write a servlet filter extending OncePerRequestFilter parsing HTTP headers.", TaskType.PRACTICE, TaskStatus.TODO, LocalDate.now().plusDays(1));
        taskRepository.save(task1_2_1_1);

        // Skill 2: Data Structures & Algorithms
        Skill skill2 = new Skill(
                user,
                "Data Structures & Algorithms",
                "Master search, sorting, tree traversals, and dynamic programming on LeetCode.",
                SkillLevel.ADVANCED,
                "Crack elite FAANG-style technical interview coding rounds.",
                SkillStatus.PUBLISHED
        );
        skill2 = skillRepository.save(skill2);

        // Skill 2 - Topic 1: Arrays & Two Pointers
        Topic topic2_1 = new Topic(skill2, "Arrays & Two Pointers", "Implement efficient search filters on linear contiguous memory structures.", 1);
        topic2_1 = topicRepository.save(topic2_1);

        // Skill 2 - Topic 1 - Subtopic 1: Fixed Window Slider
        Subtopic subtopic2_1_1 = new Subtopic(topic2_1, "Fixed Window Slider", "Apply the sliding window technique on segments of fixed, static size.", DifficultyLevel.EASY, 30, 1);
        subtopic2_1_1 = subtopicRepository.save(subtopic2_1_1);

        Task task2_1_1_1 = new Task(subtopic2_1_1, "Solve LeetCode #643", "Implement O(N) linear time sliding sum calculations for Maximum Average Subarray I.", TaskType.PRACTICE, TaskStatus.TODO, LocalDate.now());
        taskRepository.save(task2_1_1_1);

        // Skill 2 - Topic 1 - Subtopic 2: Variable Window Slider
        Subtopic subtopic2_1_2 = new Subtopic(topic2_1, "Variable Window Slider", "Expand and shrink arrays windows dynamically using slow/fast indexes.", DifficultyLevel.MEDIUM, 60, 2);
        subtopic2_1_2 = subtopicRepository.save(subtopic2_1_2);

        Task task2_1_2_1 = new Task(subtopic2_1_2, "Solve LeetCode #3", "Solve Longest Substring Without Repeating Characters using hash structures.", TaskType.PRACTICE, TaskStatus.TODO, LocalDate.now());
        taskRepository.save(task2_1_2_1);

        // Trigger progress calculations
        skillService.recalculateSkillProgress(skill1);
        skillService.recalculateSkillProgress(skill2);
    }
}
