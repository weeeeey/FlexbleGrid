import type { Meta, StoryObj } from '@storybook/react';
import Page from './page'; // 원하는 페이지 컴포넌트를 import 한다.

const meta = {
    title: 'app/Page',
    component: Page,
} satisfies Meta<typeof Page>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Home: Story = {
    args: { params: { page: 1 } },
};
