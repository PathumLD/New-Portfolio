// Export all services from a single entry point
export { skillsService } from './skills.service';
export { projectsService } from './projects.service';
export { experiencesService } from './experiences.service';
export { educationService } from './education.service';
export { volunteersService } from './volunteers.service';
export { certificatesService } from './certificates.service';
export { awardsService } from './awards.service';
export { tutoringService } from './tutoring.service';
export { blogsService } from './blogs.service';

// Re-export types
export type {
    TutoringGradeWithRelations,
    TutoringLessonWithVideos,
} from './tutoring.service';
