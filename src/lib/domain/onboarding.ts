export const ONBOARDING_KEY = 'tropico6-production-planner-onboarding-v1';

export const shouldShowOnboarding = (storage: Storage = localStorage) => storage.getItem(ONBOARDING_KEY) !== 'complete';

export function completeOnboarding(storage: Storage = localStorage) {
  storage.setItem(ONBOARDING_KEY, 'complete');
}
