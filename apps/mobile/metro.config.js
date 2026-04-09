/**
 * Expo monorepo Metro 설정 — Windows에서 백슬래시 경로 문제 회피.
 * https://docs.expo.dev/guides/monorepos/
 */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 워크스페이스 루트도 감시
config.watchFolders = [workspaceRoot];

// node_modules 탐색 경로: mobile → 루트 순
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 상위 디렉토리 자동 탐색 비활성화 (명시적 경로만 사용)
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
