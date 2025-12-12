
export interface Email {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
}

/**
 * Simulates sending an email via a backend SMTP server.
 * This triggers a client-side event to show the email 'arriving' for demo purposes.
 */
export const sendMockEmail = (to: string, subject: string, body: string) => {
  return new Promise<void>((resolve) => {
    // Simulate network latency (1.5 seconds)
    setTimeout(() => {
      const email: Email = {
        id: Math.random().toString(36).substr(2, 9),
        to,
        from: 'no-reply@autoluxe.com',
        subject,
        body,
        timestamp: new Date()
      };
      
      // Dispatch event so the UI Notification system can pick it up
      window.dispatchEvent(new CustomEvent('incoming-email', { detail: email }));
      resolve();
    }, 1500); 
  });
};
