// Export all services from a single entry point
export { skillsService } from './skills.service';
export { projectsService } from './projects.service';
export { projectCategoriesService } from './project-categories.service';
export { experiencesService } from './experiences.service';
export { educationService } from './education.service';
export { volunteersService } from './volunteers.service';
export { certificatesService } from './certificates.service';
export { awardsService } from './awards.service';
export { tutoringService } from './tutoring.service';
export { blogsService } from './blogs.service';
export { bookingsService } from './bookings.service';
export { contactMessagesService } from './contact-messages.service';
export { emailService } from './email.service';
export type { ReplyType, SendReplyInput } from './email.service';

// Re-export types
export type {
    TutoringGradeWithRelations,
    TutoringLessonWithVideos,
} from './tutoring.service';
