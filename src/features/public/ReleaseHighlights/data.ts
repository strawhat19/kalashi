import { latestRelease, recentReleases } from '../../../config/artist';

export type ReleaseHighlightsProps = {
  id?: string;
  compact?: boolean;
};

export const latestReleaseId = latestRelease.id;
export const releaseHighlights = [
  latestRelease,
  ...recentReleases.filter((release) => release.id !== latestRelease.id),
];
