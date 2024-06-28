import { Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { FetchCustomerService } from '../../../shared/services/fetchCustomers.service';
import {
  SuccessDELETE,
  SuccessGET,
  SuccessGETbyId,
  SuccessPATCH,
  SuccessPOST,
} from '../../../shared/interfaces/response/response';
import { FormService } from '../../../shared/services/form.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Company } from '../../companies/components/companies-list.component';
import { FetchCompaniesService } from '../../../shared/services/fetchCompanies.service';
import { SelectComponent } from '../../../shared/components/select.component';
import { Option } from '../../../shared/components/select.component';
import { FetchFieldService } from '../../../shared/services/fetchField.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface CustomFields {
  id: number;
  table: string;
  field: string;
  label: string;
}

@Component({
  selector: 'app-customers-form',
  standalone: true,
  templateUrl: './customers-form.component.html',
  styleUrls: [
    '../../../styles/resource.scss',
    '../../../styles/form.scss',
    '../../../styles/title-bar.scss',
  ],
  imports: [ReactiveFormsModule, CommonModule, SelectComponent],
})
export class CustomersFormComponent implements OnDestroy {
  destroyRef = inject(DestroyRef);

  segmentControl = new FormControl('', {});

  #customer = {};
  #title?: string;
  #customFields?: CustomFields[];
  #currentCompany?: Option;
  #companies: Option[] = [];
  #arrayOfCompanies: Company[] = [];

  arrOfSeg?: { segment_id: number; company_id: number; name: string }[];
  arrOfSegFront = this.arrOfSeg;

  #router = inject(Router);
  #fb = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  #formService = inject(FormService);
  #asideService = inject(AsideService);
  #dialogService = inject(DialogService);
  #fieldHttp = inject(FetchFieldService);
  #custHttp = inject(FetchCustomerService);
  #compHttp = inject(FetchCompaniesService);
  #menuServ = inject(ToolbarMenuService);

  state: boolean = false;

  normalForm = this.#fb.group({
    customer: this.#fb.group({ ...this.normalCustomer }),
    person: this.#fb.group({ ...this.person }),
    address: this.#fb.group({ ...this.address }),
    company: this.#fb.group({ ...this.company }),
    contacts: this.#fb.array([]),
    segments: this.#fb.array([]),
  });

  legalForm = this.#fb.group({
    customer: this.#fb.group({ ...this.legalCustomer }),
    person: this.#fb.group({ ...this.person }),
    address: this.#fb.group({ ...this.address }),
    company: this.#fb.group({ ...this.company }),
    contacts: this.#fb.array([]),
    segments: this.#fb.array([]),
  });

  constructor() {
    this.segmentControl.valueChanges.subscribe((search) => {
      this.arrOfSegFront = this.arrOfSeg?.filter((el) =>
        el.name.toLowerCase().includes(search?.toLowerCase() ?? '')
      );

      const item = (
        (this.form.get('segments') as FormArray).value as Array<any>
      ).find((el) => el.segment_id === '');
      item ? (item.segment = search) : null;
    });
  }

  async ngOnInit() {
    this.#asideService.changeCustomerType(this.customerQueryType as string);

    this.canProced();
    this.menuSettings();
    this.titleSettings();

    await this.getCompanies();

    if (this.idIsTrue) {
      const response = await this.getByPersonId({
        company_id: parseInt(this.company_id as string),
        person_id: parseInt(this.person_id as string),
        custom_fields: true,
        segments: true,
      });
      this.arrOfSeg = response.meta.extra.segments;
      this.arrOfSegFront = this.arrOfSeg;
      this.customFields = response.meta.extra.custom_fields;
      return this.customer != undefined
        ? this.updateFormValues(response.data)
        : null;
    }
    this.#formService.originalValues = this.form.value;
  }

  ngOnDestroy(): void {
    this.#formService.originalValues = {};
  }

  async getByPersonId(queryParams: { [key: string]: any }) {
    return (await this.#custHttp.getById(queryParams)) as SuccessGETbyId;
  }

  async getCompanies() {
    const response = (await this.#compHttp.getAll({})) as SuccessGET;
    this.#arrayOfCompanies = response.data as Company[];
    this.companies = (response.data as Company[]).map((company) => {
      return {
        id: company.company_id,
        label: company.corporate_name,
        value: company.company_id,
      };
    });
  }

  updateFormValues(body: any) {
    this.form.patchValue(body);
    this.currentCompany = this.companies.find(
      (c) => c.id === body.person.company_id
    );
    for (let contact of body.contacts) {
      const formArray = this.#fb.group({
        person_id: [contact.person_id],
        company_id: [contact.company_id],
        contact_id: [contact.contact_id],
        contact: new FormControl(contact.contact, {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        }),
        phone_number: new FormControl(contact.phone_number, {
          validators: [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(14),
            Validators.pattern(/^\d+$/),
          ],
        }),
      });
      this.contacts.push(formArray);
    }
    for (let segment of body.segments) {
      const formArray = this.#fb.group({
        person_id: [segment.person_id],
        company_id: [segment.company_id],
        segment_id: [segment.segment_id],
        segment: new FormControl(segment.name),
      });
      this.segments.push(formArray);
    }
    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;
  }

  async setCurrentOption(e: Option, control: string) {
    if (
      control === 'person.company_id' &&
      this.form.get(control).value != e.value
    ) {
      const response = (await this.getCustomFields(e.value)) as SuccessGET;
      this.arrOfSeg = response.meta.extra.segments;
      this.arrOfSegFront = this.arrOfSeg;
      const custom_fields = response.meta.extra
        .custom_fields as Array<CustomFields>;
      custom_fields && custom_fields.length
        ? (this.customFields = custom_fields)
        : (this.customFields = undefined);
      for (let contact of this.contacts.value) {
        contact.company_id = e.value;
      }
      const company = this.#arrayOfCompanies.find(
        (c) => c.company_id === e.value
      );
      this.form.get('customer.company_id').patchValue(company?.company_id);
      this.form.get('address.company_id').patchValue(company?.company_id);
      this.form.get(control).patchValue(company?.company_id);
      this.form.get('company.cnpj').patchValue(company?.cnpj);
      this.form.get('company.social_name').patchValue(company?.social_name);
      this.form
        .get('company.corporate_name')
        .patchValue(company?.corporate_name);
    }
  }

  async getCustomFields(company_id: number) {
    return this.#fieldHttp.getAll({
      custom_fields: true,
      company_id,
      segments: true,
    });
  }

  canProced() {
    return !(
      (this.customerType && this.customerType === 'normal') ||
      (this.customerType && this.customerType === 'legal')
    )
      ? this.redirect()
      : null;
  }

  menuSettings() {
    this.#menuServ.menuName = this.menuName;
    this.#menuServ.hasFilter = this.hasFilter;
  }

  titleSettings() {
    if (this.action !== 'new') {
      this.title = 'Editando';
    } else {
      this.title =
        this.customerType === 'legal'
          ? 'Novo cliente Jurídico'
          : 'Novo cliente Físico';
    }
  }

  async onSubmit() {
    if (!this.idIsTrue) {
      const response = await this.#custHttp.saveData(this.form.value);
      if (!(response as SuccessPOST).affectedRows) {
        return;
      }
      return this.redirect();
    }
    const response = await this.#custHttp.updateData(
      {
        company_id: parseInt(this.company_id as string),
        person_id: parseInt(this.person_id as string),
      },
      this.form.value
    );
    if (!(response as SuccessPATCH).affectedRows) {
      return;
    }
    return this.redirect();
  }

  redirect() {
    this.#router.navigate(['/customers']);
  }

  addSegment(formArray?: any) {
    this.state = true;

    const newFormArray = this.#fb.group({
      person_id: [this.form.get('person.person_id').value ?? ''],
      company_id: [this.form.get('person.company_id').value ?? ''],
      segment_id: [''],
      segment: [''],
    });

    if (formArray) {
      console.log(this.segments);
      this.segments.push(formArray);
      console.log(this.segments);
      return;
    }
    this.segments.push(newFormArray);
  }

  includeSegment(segment: {
    segment_id: number;
    company_id: number;
    name: string;
  }) {
    console.log(segment);

    const formArray = this.#fb.group({
      person_id: [this.form.get('person.person_id').value ?? ''],
      company_id: [segment.company_id],
      segment_id: [segment.segment_id],
      segment: [segment.name],
    });

    this.addSegment(formArray);

    const idx = (this.segments.value as Array<any>).findIndex(
      (el) => el.segment_id === '' || el.segment === ''
    );
    (this.form.get('segments') as FormArray).removeAt(idx);

    this.state = false;

    this.segments.updateValueAndValidity();
  }

  async removeSegment(idx: number) {
    this.segmentControl.reset();
    const segment = ((this.form as any).get('segments') as FormArray).at(
      idx
    ).value;
    if (segment.segment_id != null) {
      this.#dialogService.message = `Deseja remover o segmento ${segment.segment} do cliente?`;
      this.#dialogService.showDialog = true;
      this.#dialogService.subject
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(async (value) => {
          if (!value) {
            return;
          }
          await this.#custHttp.delete({
            company_id: this.company_id,
            person_id: this.person_id,
            segment_id: segment.segment_id,
          });
          return ((this.form as any).get('segments') as FormArray).removeAt(
            idx
          );
        });
    } else {
      ((this.form as any).get('segments') as FormArray).removeAt(idx);
    }
  }

  addContact() {
    (this.form as FormGroup).markAsDirty();
    return this.contacts.push(
      this.#fb.group({
        contact_id: [null],
        person_id: [this.form.get('person.person_id').value ?? null],
        company_id: [this.form.get('person.company_id').value ?? null],
        contact: [null],
        phone_number: [null],
      })
    );
  }

  async delContact(idx: number) {
    const contact = ((this.form as any).get('contacts') as FormArray).at(
      idx
    ).value;
    if (contact.contact_id != null) {
      this.#dialogService.message = `Deseja remover ${contact.contact} ${contact.phone_number} da lista de contatos?`;
      this.#dialogService.showDialog = true;
      this.#dialogService.subject
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(async (value) => {
          if (!value) {
            return;
          }
          const response = await this.#custHttp.delete({
            company_id: this.company_id,
            person_id: this.person_id,
            contact_id: contact.contact_id,
          });
          if (!(response as SuccessDELETE).affectedRows) {
            return;
          }
          return ((this.form as any).get('contacts') as FormArray).removeAt(
            idx
          );
        });
    } else {
      ((this.form as any).get('contacts') as FormArray).removeAt(idx);
    }
  }

  get contacts() {
    if (!(this.form as any).get('contacts')) {
      return new FormArray([]) as unknown as FormArray;
    }
    return (this.form as any).get('contacts') as FormArray;
  }

  get segments() {
    if (!(this.form as any).get('segments')) {
      return new FormArray([]) as unknown as FormArray;
    }
    return (this.form as any).get('segments') as FormArray;
  }

  get formDiff() {
    return this.#formService.getChangedValues();
  }
  get originalValues() {
    return this.#formService.originalValues;
  }
  get currentValues() {
    return this.#formService.currentForm.value;
  }

  get companies() {
    return this.#companies;
  }
  set companies(value: Option[]) {
    this.#companies = value;
  }

  get currentCompany() {
    return this.#currentCompany;
  }
  set currentCompany(value: Option | undefined) {
    this.#currentCompany = value;
  }

  get customFields() {
    return this.#customFields;
  }
  set customFields(value: CustomFields[] | undefined) {
    this.#customFields = value;
  }

  get customer() {
    return this.#customer;
  }
  set customer(value: any) {
    this.#customer = value;
  }

  get title() {
    return this.#title;
  }
  set title(value: string | undefined) {
    this.#title = value;
  }

  get customerType() {
    return this.#asideService.customerType();
  }
  get customerQueryType() {
    return this.#route.snapshot.queryParamMap.get('type');
  }

  get form() {
    return this.customerType === 'legal'
      ? (this.legalForm as any)
      : (this.normalForm as any);
  }

  get hasFilter() {
    return this.#route.snapshot.data[environment.FILTER] as boolean;
  }
  get menuName() {
    return this.#route.snapshot.data[environment.MENU] as string;
  }

  get company_id() {
    return this.#route.snapshot.queryParamMap.get('company_id');
  }
  get person_id() {
    return this.#route.snapshot.queryParamMap.get('person_id');
  }

  get action() {
    return this.#route.snapshot.queryParamMap.get('action');
  }
  get idIsTrue() {
    return (
      (this.action != environment.NEW || this.action === null) &&
      !isNaN(parseInt(this.person_id as string)) &&
      !isNaN(parseInt(this.company_id as string))
    );
  }

  get company() {
    return {
      corporate_name: [''],
      social_name: [''],
      cnpj: ['', { validators: [Validators.pattern(/^\d+$/)] }],
    };
  }

  get legalCustomer() {
    return {
      person_id: [''],
      company_id: [
        '',
        {
          Validators: [Validators.required],
        },
      ],
      cnpj: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(14),
            Validators.maxLength(14),
            Validators.pattern(/^\d+$/),
          ],
        },
      ],
      corporate_name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        },
      ],
      social_name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        },
      ],
      state_registration: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(9),
            Validators.pattern(/^\d+$/),
          ],
        },
      ],
    };
  }

  get normalCustomer() {
    return {
      person_id: [null],
      company_id: [
        null,
        {
          Validators: [Validators.required],
        },
      ],
      cpf: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(/^\d+$/),
          ],
        },
      ],
      first_name: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(60),
          ],
        },
      ],
      middle_name: [
        null,
        {
          validators: [Validators.minLength(2), Validators.maxLength(60)],
        },
      ],
      last_name: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(60),
          ],
        },
      ],
    };
  }

  get address() {
    return {
      person_id: [''],
      company_id: ['', { Validators: [Validators.required] }],
      add_street: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        },
      ],
      add_number: [
        '',
        {
          validators: [Validators.maxLength(10)],
        },
      ],
      add_zipcode: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
            Validators.pattern(/^\d+$/),
          ],
        },
      ],
      add_city: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(60),
          ],
        },
      ],
      add_uf: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(2),
          ],
        },
      ],
      add_neighborhood: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(60),
          ],
        },
      ],
    };
  }

  get person() {
    return {
      person_id: [''],
      company_id: ['', { Validators: [Validators.required] }],
      observation: [
        '',
        { validators: [Validators.minLength(3), Validators.maxLength(45)] },
      ],
      first_field: [
        '',
        { validators: [Validators.minLength(3), Validators.maxLength(100)] },
      ],
      second_field: [
        '',
        { validators: [Validators.minLength(3), Validators.maxLength(100)] },
      ],
      third_field: [
        '',
        { validators: [Validators.minLength(3), Validators.maxLength(100)] },
      ],
    };
  }
}
