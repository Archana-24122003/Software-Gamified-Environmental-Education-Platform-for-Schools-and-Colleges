"use client";

import { learningPaths, type SubjectKey } from "@/lib/learningPaths";

const TEACHER_CONTROLS_KEY = "learnbee_teacher_controls";
const LEGACY_TEACHER_CONTROLS_KEY = "envimission_teacher_controls";

export type TeacherActivityLockState = {
  locked: boolean;
};

export type TeacherMilestoneLockState = {
  locked: boolean;
  activities: Record<string, TeacherActivityLockState>;
};

export type TeacherCourseLockState = {
  locked: boolean;
  milestones: Record<string, TeacherMilestoneLockState>;
};

export type TeacherControlsState = {
  subjects: Record<string, TeacherCourseLockState>;
};

export type LockTarget =
  | { type: "subject"; subject: SubjectKey }
  | { type: "milestone"; subject: SubjectKey; milestone: string }
  | { type: "activity"; subject: SubjectKey; milestone: string; activity: string };

function buildDefaultControls(): TeacherControlsState {
  return {
    subjects: Object.fromEntries(
      learningPaths.map((path) => [
        path.slug,
        {
          locked: false,
          milestones: Object.fromEntries(
            path.milestones.map((milestone) => [
              milestone.slug,
              {
                locked: false,
                activities: Object.fromEntries(
                  milestone.activities.map((activity) => [activity.slug, { locked: false }]),
                ),
              },
            ]),
          ),
        },
      ]),
    ),
  };
}

function mergeWithDefaults(input?: Partial<TeacherControlsState> | null): TeacherControlsState {
  const defaults = buildDefaultControls();

  if (!input?.subjects) {
    return defaults;
  }

  return {
    subjects: Object.fromEntries(
      learningPaths.map((path) => {
        const existingSubject = input.subjects?.[path.slug];
        const mergedMilestones = Object.fromEntries(
          path.milestones.map((milestone) => {
            const existingMilestone = existingSubject?.milestones?.[milestone.slug];

            return [
              milestone.slug,
              {
                locked: existingMilestone?.locked ?? false,
                activities: Object.fromEntries(
                  milestone.activities.map((activity) => [
                    activity.slug,
                    {
                      locked: existingMilestone?.activities?.[activity.slug]?.locked ?? false,
                    },
                  ]),
                ),
              },
            ];
          }),
        );

        return [
          path.slug,
          {
            locked: existingSubject?.locked ?? false,
            milestones: mergedMilestones,
          },
        ];
      }),
    ),
  };
}

export function getTeacherControls() {
  if (typeof window === "undefined") {
    return buildDefaultControls();
  }

  const currentValue = localStorage.getItem(TEACHER_CONTROLS_KEY);
  const legacyValue = localStorage.getItem(LEGACY_TEACHER_CONTROLS_KEY);

  if (!currentValue && legacyValue) {
    localStorage.setItem(TEACHER_CONTROLS_KEY, legacyValue);
  }

  const raw = localStorage.getItem(TEACHER_CONTROLS_KEY);

  if (!raw) {
    return buildDefaultControls();
  }

  try {
    return mergeWithDefaults(JSON.parse(raw) as TeacherControlsState);
  } catch {
    return buildDefaultControls();
  }
}

export function saveTeacherControls(state: TeacherControlsState) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TEACHER_CONTROLS_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("teacherControlsUpdated"));
}

export function updateTeacherControls(updater: (current: TeacherControlsState) => TeacherControlsState) {
  const next = updater(getTeacherControls());
  saveTeacherControls(next);
  return next;
}

export function setLockState(target: LockTarget, locked: boolean) {
  return updateTeacherControls((current) => {
    const next = mergeWithDefaults(current);

    if (target.type === "subject") {
      next.subjects[target.subject].locked = locked;
      return next;
    }

    if (target.type === "milestone") {
      next.subjects[target.subject].milestones[target.milestone].locked = locked;
      return next;
    }

    next.subjects[target.subject].milestones[target.milestone].activities[target.activity].locked = locked;
    return next;
  });
}

export function isSubjectLocked(subject: SubjectKey, controls = getTeacherControls()) {
  return controls.subjects[subject]?.locked ?? false;
}

export function isMilestoneLocked(subject: SubjectKey, milestone: string, controls = getTeacherControls()) {
  return isSubjectLocked(subject, controls) || controls.subjects[subject]?.milestones[milestone]?.locked || false;
}

export function isActivityLocked(
  subject: SubjectKey,
  milestone: string,
  activity: string,
  controls = getTeacherControls(),
) {
  return (
    isMilestoneLocked(subject, milestone, controls) ||
    controls.subjects[subject]?.milestones[milestone]?.activities[activity]?.locked ||
    false
  );
}
