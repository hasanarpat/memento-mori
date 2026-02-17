import { CollectionConfig } from 'payload';

export const Messages: CollectionConfig = {
    slug: 'messages',
    admin: {
        useAsTitle: 'subject',
        defaultColumns: ['subject', 'name', 'status', 'createdAt'],
    },
    access: {
        create: () => true, // Anyone can create (submit form)
        read: ({ req: { user } }) => !!user, // Only admins can read
        update: ({ req: { user } }) => !!user, // Only admins can update
        delete: ({ req: { user } }) => !!user, // Only admins can delete
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'subject',
            type: 'text',
            required: true,
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'new',
            options: [
                { label: 'New', value: 'new' },
                { label: 'Read', value: 'read' },
                { label: 'Replied', value: 'replied' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'adminReply',
            type: 'textarea',
            label: 'Admin Reply (Sends Email)',
            admin: {
                description: 'Entering text here and saving will send an email to the user.',
            },
        },
        {
            name: 'replySentAt',
            type: 'date',
            admin: {
                readOnly: true,
                position: 'sidebar',
            },
        },
    ],
    hooks: {
        afterChange: [
            async ({ doc, previousDoc, req, operation }) => {
                if (operation === 'update' && doc.adminReply && doc.adminReply !== previousDoc?.adminReply) {
                    try {
                        await req.payload.sendEmail({
                            to: doc.email,
                            from: 'onboarding@resend.dev', // Ensure this matches your verfied sender or default
                            subject: `Re: ${doc.subject} - Memento Mori`,
                            html: `
                <div style="font-family: serif; color: #1a0a1f; padding: 20px;">
                  <h2 style="border-bottom: 1px solid #5c0a0a; padding-bottom: 10px;">Response from Memento Mori</h2>
                  <p>Dear ${doc.name},</p>
                  <p>We have received your message regarding "<strong>${doc.subject}</strong>".</p>
                  <div style="background-color: #f5f5f5; padding: 15px; border-left: 3px solid #5c0a0a; margin: 20px 0;">
                    ${doc.adminReply.replace(/\n/g, '<br>')}
                  </div>
                  <p>Best regards,<br>The Memento Mori Team</p>
                </div>
              `,
                        });

                        // Update status to replied if not already
                        if (doc.status !== 'replied') {
                            req.payload.update({
                                collection: 'messages',
                                id: doc.id,
                                data: {
                                    status: 'replied',
                                    replySentAt: new Date().toISOString(),
                                },
                                req, // Pass the request context
                            });
                        }
                    } catch (error) {
                        console.error('Failed to send reply email:', error);
                    }
                }
            },
        ],
    },
};
