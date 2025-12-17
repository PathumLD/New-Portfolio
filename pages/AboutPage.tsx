import React from 'react';
import { profileData } from '../data/profile';
import { FiAward, FiHeart, FiZap, FiMapPin, FiBriefcase, FiClock, FiGlobe, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';

const AboutPage: React.FC = () => {
  const bioSections = profileData.longBio.trim().split('\n\n').filter(section => section.trim());

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div
        className="animated-element animate-fade-in-up text-center mb-16"
        style={{ '--stagger': 1 } as React.CSSProperties}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-500/20 mb-6">
          <FiHeart className="w-4 h-4" />
          Get to know me
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          About Me
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A little bit about my journey, passions, and what drives me forward.
        </p>
      </div>

      {/* Profile Overview Section */}
      <div
        className="animated-element animate-fade-in-up mb-20"
        style={{ '--stagger': 2 } as React.CSSProperties}
      >
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Profile Image */}
          <div className="lg:col-span-2">
            <div className="relative max-w-sm mx-auto">
              {/* Gradient Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-blue-400 dark:from-primary-500 dark:to-cyan-500 rounded-3xl blur-2xl opacity-20"></div>

              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white/50 dark:border-gray-800/50 shadow-2xl">
                  <img
                    src={profileData.profilePicture}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-primary-500 to-blue-500 dark:from-primary-400 dark:to-cyan-400 rounded-2xl p-4 shadow-xl">
                  <FiZap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl px-4 py-2 shadow-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{profileData.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio and Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Name and Title */}
            <div className="bg-gradient-to-br from-primary-500/10 to-blue-500/10 dark:from-primary-400/10 dark:to-cyan-400/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-500/20 dark:border-primary-400/20 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profileData.name}</h2>
              <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-4">{profileData.title}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profileData.shortBio}</p>
            </div>

            {/* Contact & Education Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-400/10 rounded-lg p-2">
                    <FiMail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Email</p>
                    <a href={`mailto:${profileData.email}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                      {profileData.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-400/10 rounded-lg p-2">
                    <FiPhone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Phone</p>
                    <a href={`tel:${profileData.phone}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {profileData.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-400/10 rounded-lg p-2">
                    <HiAcademicCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Education</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{profileData.education}</p>
                  </div>
                </div>
              </div>
              {/* <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 col-span-1 sm:col-span-1">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-400/10 rounded-lg p-2">
                    <HiAcademicCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Education</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{profileData.education}</p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Quick Info Cards - Moved from left side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-400/10 rounded-lg p-2">
                    <FiMapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Location</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{profileData.location}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-400/10 rounded-lg p-2">
                    <FiBriefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Experience</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{profileData.yearsOfExperience}+ Years</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/10 dark:bg-green-400/10 rounded-lg p-2">
                    <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Status</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{profileData.availability}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-500/10 dark:bg-primary-400/10 rounded-lg p-2">
                    <FiGlobe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Languages</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{profileData.languages.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Me Story */}
      <div
        className="animated-element animate-fade-in-up mb-20"
        style={{ '--stagger': 3 } as React.CSSProperties}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-500/20 mb-6">
            <FiHeart className="w-4 h-4" />
            My Story
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Who I Am
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn more about my journey and what drives my passion
          </p>
        </div>

        <div className="space-y-6">
          {bioSections.map((section, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg ">
                {section.trim()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div
        className="animated-element animate-fade-in-up pb-20"
        style={{ '--stagger': 4 } as React.CSSProperties}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-500/20 mb-6">
            <FiAward className="w-4 h-4" />
            Core Skills
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Technologies & Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The technologies I use to bring ideas to life
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {profileData.skills.map((skill, index) => (
            <div
              key={`${skill.name}-${index}`}
              className="group flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary-500/50 dark:hover:border-primary-400/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <skill.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats/Highlights Section */}
      <div
        className="animated-element animate-fade-in-up mt-20"
        style={{ '--stagger': 5 } as React.CSSProperties}
      >
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-500 to-blue-500 dark:from-primary-600 dark:to-cyan-600 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold mb-2">{profileData.yearsOfExperience}+</div>
            <div className="text-white/90 font-medium">Years Experience</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Projects Completed</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Happy Clients</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div
        className="animated-element animate-fade-in-up mt-20 text-center"
        style={{ '--stagger': 6 } as React.CSSProperties}
      >
        <div className="bg-gradient-to-r from-primary-500/10 to-blue-500/10 dark:from-primary-400/10 dark:to-cyan-400/10 rounded-3xl p-8 md:p-12 border border-primary-500/20 dark:border-primary-400/20">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Start a Conversation
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl font-medium border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              View My Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;