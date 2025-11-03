export const users = [
    { id: '1', name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Elise Moreau', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '6', name: 'François Lambert', avatar: 'https://i.pravatar.cc/150?img=6' },
];

export const assigneeAvatars: { [key: string]: string } = users.reduce((acc, user) => {
    acc[user.id] = user.avatar;
    return acc;
}, {} as { [key: string]: string });
