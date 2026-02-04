"use client";

export default function NewsletterForm() {
  return (
    <form
      className="home-newsletter-form"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="your@email.com"
        required
        aria-label="Email for newsletter"
      />
      <button type="submit">Subscribe</button>
    </form>
  );
}
