import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private fb = inject(FormBuilder);

  // WhatsApp config
  private readonly phoneNumber = '573135352743'; // Assuming Colombia (+57) based on standard LATAM numbering 

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = signal(false);

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);

      const { name, email, message } = this.contactForm.value;

      // Formatting message for WhatsApp
      const whatsappText = `¡Hola Ricardo!%0A%0ASoy *${name}* (${email}).%0A%0A${message}`;
      const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${whatsappText}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Reset after a short delay
      setTimeout(() => {
        this.contactForm.reset();
        this.isSubmitting.set(false);
      }, 1000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
