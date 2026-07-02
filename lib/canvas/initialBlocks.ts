import type { Block } from "@/types/blocks";

const NOW = "2026-07-01T10:32:00.000Z";

/** The five starter blocks every new workspace canvas begins with. */
export const initialBlocks: Block[] = [
  {
    id: "block-1",
    type: "ai-chat",
    position: { x: 100, y: 100 },
    size: { width: 420, height: 320 },
    lastEditedBy: "Aditya",
    lastEditedAt: NOW,
    data: {
      title: "AI Chat",
      messages: [
        {
          role: "user",
          content: "Can you help me brainstorm features for our new product?",
          timestamp: "10:32 AM",
          user: "Aditya",
        },
        {
          role: "assistant",
          content:
            "Absolutely! Here are some ideas based on your brief:\n• Real-time collaboration\n• AI-powered insights\n• Custom workflows\n• Seamless integrations\n• Advanced permissions",
          timestamp: "10:32 AM",
        },
      ],
    },
  },
  {
    id: "block-2",
    type: "generate-code",
    position: { x: 600, y: 80 },
    size: { width: 420, height: 340 },
    lastEditedBy: "Maya",
    lastEditedAt: NOW,
    data: {
      title: "Generate Code",
      language: "Python",
      code: "def calculate_metrics(data):\n    results = {}\n    for key, values in data.items():\n        total = sum(values)\n        count = len(values)\n        average = total / count if count else 0\n        results[key] = {\n            'total': total,\n            'count': count,\n            'average': average\n        }\n    return results",
    },
  },
  {
    id: "block-3",
    type: "user-flow",
    position: { x: 100, y: 450 },
    size: { width: 440, height: 300 },
    lastEditedBy: "Sam",
    lastEditedAt: NOW,
    data: {
      title: "User Flow",
      nodes: [
        { id: "start", label: "Start", type: "start" },
        { id: "signup", label: "Sign Up", type: "action" },
        { id: "onboarding", label: "Onboarding", type: "action" },
        { id: "dashboard", label: "Dashboard", type: "action" },
        { id: "create", label: "Create Project", type: "action" },
        { id: "invite", label: "Invite Team", type: "end" },
      ],
    },
  },
  {
    id: "block-4",
    type: "ai-chat",
    position: { x: 580, y: 430 },
    size: { width: 420, height: 320 },
    lastEditedBy: "Bhavishya",
    lastEditedAt: NOW,
    data: {
      title: "AI Chat",
      messages: [
        {
          role: "user",
          content: "How can we improve user engagement?",
          timestamp: "11:03 AM",
          user: "Bhavishya",
        },
        {
          role: "assistant",
          content:
            "Here are some strategies that work well:\n1. Personalization\n2. Gamification\n3. Regular updates\n4. User feedback loops",
          timestamp: "11:03 AM",
        },
      ],
    },
  },
  {
    id: "block-5",
    type: "api-integration",
    position: { x: 1050, y: 80 },
    size: { width: 420, height: 340 },
    lastEditedBy: "Alex",
    lastEditedAt: NOW,
    data: {
      title: "API Integration",
      language: "TypeScript",
      code: "import { api } from '@/lib/api'\n\nexport async function fetchProjects() {\n  try {\n    const response = await api.get('/projects')\n    return response.data\n  } catch (error) {\n    console.error('Failed to fetch projects:', error)\n    throw error\n  }\n}\n\nexport async function createProject(data: ProjectData) {\n  return await api.post('/projects', data)\n}",
    },
  },
];
