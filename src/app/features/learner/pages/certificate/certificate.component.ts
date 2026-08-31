import { Component } from '@angular/core';
import { CertificateService } from '../../../../core/services/certificate.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent {
  number = '';
  result: any;
  loading = false;

  constructor(private readonly certificates: CertificateService) {}

  verify(): void {
    if (!this.number.trim()) return;

    this.loading = true;
    this.result = null;

    this.certificates.verify(this.number.trim()).subscribe({
      next: (response: any) => {
        this.result = response?.data ?? response;
        this.loading = false;
      },
      error: () => {
        this.result = { valid: false };
        this.loading = false;
      }
    });
  }
}
