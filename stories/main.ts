import { StorybookConfig } from '@storybook/experimental-nextjs-vite';

const config: StorybookConfig = {
    // ...
    // framework: '@storybook/react-webpack5', 👈 Remove this
    framework: '@storybook/experimental-nextjs-vite', // 👈 Add this
    stories: ['../app/**/*.stories.tsx'],
};

export default config;
