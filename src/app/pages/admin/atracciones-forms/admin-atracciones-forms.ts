import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AtraccionesService, AtraccionPayload } from '../../../services/atracciones.service';
import { DestinoService, Destino } from '../../../services/destino.service';
import { CategoriaService, Categoria } from '../../../services/categoria.service';
import { IdiomaService, Idioma } from '../../../services/idioma.service';
import { IncluyeService, Incluye } from '../../../services/incluye.service';
import { NoIncluyeService, NoIncluye } from '../../../services/noincluye.service';
import { TagService, Tag } from '../../../services/tag.service';

@Component({
  selector: 'app-admin-atracciones-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-atracciones-forms.html',
  styleUrls: ['./admin-atracciones-forms.scss']
})
export class AdminAtraccionesFormsComponent implements OnInit {
  isEdit = false;
  atraccionId: string | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  // Select Data
  destinos: Destino[] = [];
  categorias: Categoria[] = [];
  idiomas: Idioma[] = [];
  incluies: Incluye[] = [];
  noIncluies: NoIncluye[] = [];
  tags: Tag[] = [];

  payload: AtraccionPayload = {
    destinoId: 0,
    nombre: '',
    descripcion: '',
    direccion: '',
    duracionMinutos: 0,
    puntoEncuentro: '',
    moneda: 'USD',
    precioReferencia: 0,
    incluyeTransporte: false,
    incluyeAcompaniante: false,
    categoriaIds: [],
    idiomaIds: [],
    incluyeIds: [],
    noIncluyeIds: [],
    tagIds: []
  };

  constructor(
    private svc: AtraccionesService,
    private destinoSvc: DestinoService,
    private categoriaSvc: CategoriaService,
    private idiomaSvc: IdiomaService,
    private incluyeSvc: IncluyeService,
    private noIncluyeSvc: NoIncluyeService,
    private tagSvc: TagService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    this.loading = true;
    try {
      const [destinos, categorias, idiomas, incluies, noIncluies, tags] = await Promise.all([
        this.destinoSvc.getAll(),
        this.categoriaSvc.getAll(),
        this.idiomaSvc.getAll(),
        this.incluyeSvc.getAll(),
        this.noIncluyeSvc.getAll(),
        this.tagSvc.getAll()
      ]);

      this.destinos = destinos;
      this.categorias = categorias;
      this.idiomas = idiomas;
      this.incluies = incluies;
      this.noIncluies = noIncluies;
      this.tags = tags;

      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.isEdit = true;
          this.atraccionId = idParam;
          this.cargarAtraccion(this.atraccionId);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } catch (e: any) {
      this.error = 'Error al cargar datos necesarios';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async cargarAtraccion(id: string) {
    try {
      const data = await this.svc.getInternalById(id);
      this.payload = {
        destinoId: data.destino?.id || 0,
        nombre: data.nombre,
        descripcion: data.descripcion,
        direccion: data.direccion,
        duracionMinutos: data.duracionMinutos,
        puntoEncuentro: data.puntoEncuentro,
        moneda: data.moneda,
        precioReferencia: data.precioReferencia,
        incluyeTransporte: data.incluyeTransporte,
        incluyeAcompaniante: data.incluyeAcompaniante,
        categoriaIds: data.categorias?.map((c: any) => c.id) || [],
        idiomaIds: data.idiomas?.map((i: any) => i.id) || [],
        incluyeIds: data.incluyes?.map((i: any) => i.id) || [],
        noIncluyeIds: data.noIncluyes?.map((i: any) => i.id) || [],
        tagIds: data.tagAtracciones?.map((t: any) => t.id) || []
      };
    } catch (e: any) {
      this.error = e.response?.data?.message || 'Error al cargar la atracción';
      this.showToast(this.error, 'error');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  toggleItem(list: number[], id: number) {
    const index = list.indexOf(id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
  }

  isSelected(list: number[], id: number): boolean {
    return list.includes(id);
  }

  async guardar() {
    this.error = '';
    this.validationErrors = [];
    
    if (!this.payload.nombre || !this.payload.destinoId) {
      this.error = 'El nombre y el destino son requeridos';
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit && this.atraccionId) {
        await this.svc.update(this.atraccionId, this.payload);
        this.showToast('Atracción actualizada con éxito', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('Atracción creada con éxito', 'success');
      }
      setTimeout(() => this.router.navigate(['/admin/atracciones']), 1500);
    } catch (e: any) {
      const data = e.response?.data;
      if (data && data.Errors) {
        this.validationErrors = data.Errors;
      } else {
        this.error = data?.message || 'Error al guardar';
      }
      this.showToast('Ocurrió un error al guardar', 'error');
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { visible: true, message, type };
    this.cdr.detectChanges();
    setTimeout(() => { 
      this.toast.visible = false; 
      this.cdr.detectChanges();
    }, 3500);
  }
}
