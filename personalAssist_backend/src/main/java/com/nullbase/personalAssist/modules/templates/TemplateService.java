package com.nullbase.personalAssist.modules.templates;

import com.nullbase.personalAssist.entity.User;
import com.nullbase.personalAssist.modules.drafts.Draft;
import com.nullbase.personalAssist.modules.drafts.DraftRepository;
import com.nullbase.personalAssist.modules.drafts.DraftStatus;
import com.nullbase.personalAssist.modules.drafts.dto.DraftDto;
import com.nullbase.personalAssist.modules.roadmap.*;
import com.nullbase.personalAssist.modules.templates.dto.TemplateDto;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TemplateService {

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private DraftRepository draftRepository;

    @PostConstruct
    public void init() {
        if (templateRepository.count() == 0) {
            seedTemplates();
        }
    }

    @Transactional(readOnly = true)
    public List<TemplateDto> getAllAvailableTemplates(User user) {
        return templateRepository.findAllAvailable(user)
                .stream()
                .map(TemplateDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TemplateDto getTemplateById(UUID id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Template not found with ID: " + id));
        return new TemplateDto(template);
    }

    @Transactional
    public DraftDto importAsDraft(UUID templateId, User user) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("Template not found with ID: " + templateId));

        // Create a deep copy of the template's JSON
        RoadmapSchema schemaCopy = copySchema(template.getTemplateJson());

        Draft draft = new Draft(
                user,
                null, // No skill linked yet
                "Draft of " + template.getName(),
                schemaCopy,
                DraftStatus.DRAFT
        );

        Draft saved = draftRepository.save(draft);
        return new DraftDto(saved);
    }

    private RoadmapSchema copySchema(RoadmapSchema original) {
        if (original == null) return null;
        RoadmapSchema copy = new RoadmapSchema();
        copy.setSchemaVersion(original.getSchemaVersion());
        
        if (original.getSkill() != null) {
            RoadmapSkill sk = original.getSkill();
            copy.setSkill(new RoadmapSkill(sk.getName(), sk.getDescription(), sk.getLevel(), sk.getGoal()));
            copy.getSkill().setTags(new ArrayList<>(sk.getTags()));
        }

        if (original.getTopics() != null) {
            for (RoadmapTopic t : original.getTopics()) {
                RoadmapTopic tCopy = new RoadmapTopic(t.getTitle(), t.getDescription(), t.getOrderIndex());
                tCopy.setPrerequisites(new ArrayList<>(t.getPrerequisites()));
                
                if (t.getSubtopics() != null) {
                    for (RoadmapSubtopic s : t.getSubtopics()) {
                        RoadmapSubtopic sCopy = new RoadmapSubtopic(s.getTitle(), s.getDescription(), s.getDifficulty(), s.getEstimatedMinutes(), s.getOrderIndex());
                        
                        if (s.getTasks() != null) {
                            for (RoadmapTask tk : s.getTasks()) {
                                sCopy.getTasks().add(new RoadmapTask(tk.getTitle(), tk.getDescription(), tk.getTaskType(), tk.getPriority(), tk.getEstimatedMinutes()));
                            }
                        }
                        tCopy.getSubtopics().add(sCopy);
                    }
                }
                copy.getTopics().add(tCopy);
            }
        }
        
        copy.setPrerequisites(new ArrayList<>(original.getPrerequisites()));
        return copy;
    }

    private void seedTemplates() {
        // Template 1: Full Stack Web Development
        RoadmapSchema programmingSchema = new RoadmapSchema();
        RoadmapSkill pSkill = new RoadmapSkill("Full Stack Web Development", "A complete pathway to master web backend and frontend", "BEGINNER", "Build custom full stack apps");
        pSkill.getTags().add("web");
        pSkill.getTags().add("programming");
        pSkill.getTags().add("javascript");
        programmingSchema.setSkill(pSkill);

        List<RoadmapTopic> pTopics = new ArrayList<>();
        
        // Topic 1: Frontend Foundations
        RoadmapTopic t1 = new RoadmapTopic("Frontend Foundations", "Master HTML, CSS and JS basics", 0);
        
        RoadmapSubtopic s1 = new RoadmapSubtopic("HTML5 and Semantic Web", "Learn core tags and accessibility", "EASY", 120, 0);
        s1.getTasks().add(new RoadmapTask("Build a Personal Profile Page", "Create a responsive semantic profile site", "PROJECT", "HIGH", 120));
        s1.getTasks().add(new RoadmapTask("Study MDN Accessibility Guide", "Read through screen reader and keyboard accessibility practices", "READING", "MEDIUM", 60));
        
        RoadmapSubtopic s2 = new RoadmapSubtopic("CSS3 Grid & Flexbox Layouts", "Modern CSS styling principles", "MEDIUM", 180, 1);
        s2.getTasks().add(new RoadmapTask("Replicate a Dashboard Layout", "Code up a grid dashboard without frameworks", "PRACTICE", "HIGH", 120));

        t1.getSubtopics().add(s1);
        t1.getSubtopics().add(s2);
        pTopics.add(t1);

        // Topic 2: Node.js Backend API Development
        RoadmapTopic t2 = new RoadmapTopic("Node.js Backend Development", "Create scalable REST services using Express", 1);
        t2.getPrerequisites().add("Frontend Foundations");

        RoadmapSubtopic s3 = new RoadmapSubtopic("Express Routing & Middleware", "Build flexible APIs with Node.js", "MEDIUM", 240, 0);
        s3.getTasks().add(new RoadmapTask("Code a REST API for Tasks", "Implement task schema, routers and JSON databases", "PROJECT", "CRITICAL", 180));

        t2.getSubtopics().add(s3);
        pTopics.add(t2);

        programmingSchema.setTopics(pTopics);

        Template pTemplate = new Template("Full Stack Web Development", TemplateCategory.PROGRAMMING, "From UI components to API routing: master modern full stack web patterns.", programmingSchema, true, null);
        templateRepository.save(pTemplate);

        // Template 2: UI/UX Design Fundamentals
        RoadmapSchema designSchema = new RoadmapSchema();
        RoadmapSkill dSkill = new RoadmapSkill("UI/UX Design Fundamentals", "Master Figma, user flows, visual systems and high-fidelity mockups", "BEGINNER", "Design high-converting web apps");
        dSkill.getTags().add("ui-ux");
        dSkill.getTags().add("design");
        designSchema.setSkill(dSkill);

        List<RoadmapTopic> dTopics = new ArrayList<>();

        RoadmapTopic dt1 = new RoadmapTopic("User Research & Wireframing", "Identify user needs and build simple lo-fi structures", 0);
        
        RoadmapSubtopic ds1 = new RoadmapSubtopic("User Journey Mapping", "Trace users path through key screens", "MEDIUM", 150, 0);
        ds1.getTasks().add(new RoadmapTask("Map out a checkout flow journey", "Design step-by-step user journey map", "PRACTICE", "MEDIUM", 90));
        
        dt1.getSubtopics().add(ds1);
        dTopics.add(dt1);
        designSchema.setTopics(dTopics);

        Template dTemplate = new Template("UI/UX Design Fundamentals", TemplateCategory.DESIGN, "Develop standard wireframing, layout hierarchy, and style frameworks in Figma.", designSchema, true, null);
        templateRepository.save(dTemplate);
    }
}
