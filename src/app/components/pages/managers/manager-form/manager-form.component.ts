import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {Manager} from "../../../../model/manager";
import {ImageUtils} from "../../../../utils/image-utils";
import {ManagersService} from "../../../../services/managers/managers.service";
import {ToastrService} from "ngx-toastr";
import {NgxLoadingModule} from "ngx-loading";

@Component({
  selector: 'app-manager-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    NgxLoadingModule
  ],
  templateUrl: './manager-form.component.html',
  styleUrl: './manager-form.component.scss'
})
export class ManagerFormComponent implements OnInit {

  managerForm:FormGroup;

  mangerData: Manager;
  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  loading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ManagerFormComponent>,
    private toastr: ToastrService,
    private managersService: ManagersService,
    @Inject(MAT_DIALOG_DATA) public data: {editMode: boolean, manager: Manager }
  ) {}


  ngOnInit(): void {
    this.mangerData = this.data?.manager as any;
    this.createForm();
  }

  createForm(): void {
    const editingData: Manager = JSON.parse(JSON.stringify(this.mangerData ?? {}));
    this.managerForm = this.fb.group({
      id: [editingData?.id],
      name: [editingData?.name, Validators.required],
      image: [editingData?.image, Validators.required],
    });
    if (editingData?.image) {
      this.imagePreview = editingData.image;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.data?.editMode) {
      this.createManager();
    } else {
      this.updateManager();
    }
  }

  async createManager(): Promise<void> {
    if (this.managerForm.valid && this.imageFile) {
      try {
        this.loading = true;
        const imageUrl = await ImageUtils.getImageUrl(this.imageFile);
        const managerData = {
          ...this.managerForm.value,
          image: imageUrl
        };
        await this.managersService.addManager(managerData).then( () => {
          this.toastr.success('', 'Manager added successfully.');
          this.dialogRef.close({ type: 'success' });
          this.loading = false;
        });

      } catch (error: any) {
        this.loading = false;
        this.toastr.error(error, 'Something went wrong.');
      }
    }
  }

  async updateManager(): Promise<void> {
    if (this.managerForm.valid) {
      try {
        this.loading = true;
        let imageUrl;
        if (this.imageFile) {
          imageUrl = await ImageUtils.getImageUrl(this.imageFile);
        } else {
          imageUrl = this.data?.manager?.image
        }
        const mangerData = {
          ...this.managerForm.value,
          image: imageUrl
        };
        await this.managersService.editManager(this.mangerData?.id, mangerData).then( (mangers: any) => {
          this.toastr.success('', 'Manager modified successfully.');
          this.dialogRef.close({type: 'success', mangers});
          this.loading = false;
        });
      } catch (error: any) {
        this.loading = false;
        this.toastr.error(error, 'Something went wrong.');
      }
    }
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.imageFile = target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result; // Set the preview image source
      };

      reader.readAsDataURL(this.imageFile); // Read file as data URL
      this.managerForm.patchValue({ image: this.imageFile });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
