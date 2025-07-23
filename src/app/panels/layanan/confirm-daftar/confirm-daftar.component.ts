import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {Subscription, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SelectItem} from 'primeng/api';
import {CommonService} from 'src/app/services/common.service';
import {ConfirmDialogMsg} from '../../../api/confirm-dialog-msg';

@Component({
  selector: 'app-confirm-daftar',
  templateUrl: './confirm-daftar.component.html',
  styleUrls: ['./confirm-daftar.component.scss']
})
export class ConfirmDaftarComponent implements OnInit {
  ModalPembayaran: boolean = false;
  listAntrian: any;
  antrianDisplay: any = {};
  antrianSelected: any;
  tarifJasaFixed: any = {};
  OptKlinik = [
    {label: 'Pilih Klinik', value: ''}
  ];
  listKlinik: any;
  klinikId!: number;
  klinikKonfig!: number;
  bayar!: number;
  kembali!: number;
  disableButton = true;
  selectedKlinik: any;
  // selectedKlinikSubs: Subscription;
  showListKlinik = true;
  tanggalDaftar!: Date/* = new Date(Date.now())*/;
  labelButton = 'Bayar';
  labelInfo = 'Pendaftaran';
  roleId!: number;
  showUnitKlinik = false;
  colTitleUnitKlinik = 'Unit Pelayanan';
  accessView:any = null;
  dataChangedSubs!: Subscription;
  blockedAdmin = false;  // TODO: Block panel
  private kodeProviderBpjs!: string;
  dlgKategInit: any;    // Select kategori pasien
  private pasien: any;
  private configOk: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private commonSvc: CommonService, public router: Router) {
    this.ModalPembayaran = false;
  }

  ngOnInit(): void {
    this.antrianDisplay.tglNow = new Date(Date.parse('2020-01-23T07:56:38.896Z'));
    this.commonSvc.getViewsAccessRoles(this.destroy$, (avr: any, roleId: any) => {
      console.log(avr);
      console.log(roleId);
      this.klinikId = parseInt(avr.klinikId, 10);
      this.selectedKlinik = this.klinikId;

      if (avr.list != null) {
        const path = '/admin/layanan/anggota';
        const list = avr.list.filter(
            (en: any) => en.accessViewPath != null && en.accessViewPath.indexOf(path) >= 0);

        if (list.length > 0) {
          this.accessView = list[0];
        }
      }
      this.commonSvc.httpGet(`auth`)
          .pipe(takeUntil(this.destroy$)).subscribe(respo => {
        const tglISO = respo.now.substring(0, 19) + '+07:00';
        this.tanggalDaftar = new Date(Date.parse(tglISO));
        this.antrianDisplay.tglNow = new Date(Date.parse(tglISO));
        this.klinikKonfig = Number(avr.konfig);
        this.showUnitKlinik = Number(avr.organLayan) === 1;
        // this.klinikKonfig = Number(avr.Konfig) & 0x01;
        this.roleId = roleId;
        // this.showListKlinik = this.commonService.showKlinikList();

        this.getKlinik();
        if (this.showUnitKlinik) {
          this.colTitleUnitKlinik = 'Nama Poli/Unit Pelayanan';
        }
        this.getAntrian();
        this.commonSvc.httpGet(`klinik/${this.klinikId}`)
            .pipe(takeUntil(this.destroy$)).subscribe(data => {
          this.kodeProviderBpjs = data.kodeProvider;
        }, () => {
        });
      });
    });

    this.dataChangedSubs = this.commonSvc.getDataChangedSubject()
        .subscribe((nCode: any) => {
          if (nCode === 2) {
            this.getAntrian();
          }
        });

    // TODO: Resolve this
    /*
    this.store.dispatch(new PelayananMedikActions.AddGenStateAction({
      state: {
        menuDisabled: false
      }
    }));
*/
    this.commonSvc.getBlockSubjectAdmin()
        .pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.blockedAdmin = value;
    });
  }

  ngOnDestroy() {
    this.dataChangedSubs.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getKlinik() {
    if (this.roleId === 1) {
      this.commonSvc.httpGet(`Klinik`)
          .pipe(takeUntil(this.destroy$)).subscribe(
          (data) => {
            if (data.length > 0) {
              this.listKlinik = data;
              for (let i = 0; i < data.length; i++) {
                this.OptKlinik.push({label: data[i].nama, value: data[i].id});
              }
            } else {
              this.listKlinik = [];
              this.OptKlinik = [];
            }
            if (data && data) {
            }
          }
      );
    }
  }

  onChangeKlinik() {
    this.getAntrian();
  }

  onSelectTgl(ev: any) {
    this.getAntrian();
  }

  private getAntrian() {
    // this.commonSvc.getBlockSubjectAdmin().next(true);
    this.blockedAdmin = true;
/*
    const params: URLSearchParams = new URLSearchParams();
    params.set('SortBy', 'waktuBooking');
    params.set('IsSortAscending', 'true');
    params.set('WaktuBooking', this.tanggalDaftar.toDateString());
    params.set('FilterBy', 'belumBayar');
    params.set('KlinikId', this.klinikId.toString());
    // params.set('DokterId', idDokter);
    // params.set('UnitKlinikId', idUnitKlinik);

    return this.service.get(`${environment.url}pelayananrj`, { search: params}).map(
        (data) => data.json()
    );
*/
    const params = new HttpParams()
        .set('SortBy', 'waktuBooking')
        .set('IsSortAscending', 'true')
        .set('WaktuBooking', this.tanggalDaftar.toDateString())
        .set('FilterBy', 'belumBayar')
        .set('KlinikId', this.klinikId.toString());

    this.commonSvc.httpGet(`pelayananrj`, true, params)
        .pipe(takeUntil(this.destroy$)).subscribe((data) => {
          this.listAntrian = data;
          if (this.showUnitKlinik) {
            for (let i = 0; i < this.listAntrian.length; i++) {
              this.listAntrian[i]['noIndex'] = i + 1;
              this.listAntrian[i].namaUnitKlinik = this.listAntrian[i].namaPoliKlinik + '/'
                  + this.listAntrian[i].namaUnitKlinik;
            }
          } else {
            for (let i = 0; i < this.listAntrian.length; i++) {
              this.listAntrian[i]['noIndex'] = i + 1;
            }
          }
          this.blockedAdmin = false;
        }
    );
  }

  onRowSelected(event: any) {
    this.antrianSelected = [];
    this.antrianSelected = event.data;
    this.antrianDisplay.noRM = event.data.noRm;
    this.antrianDisplay.nama = event.data.nama;
    if (this.antrianSelected.namaAsuransi !== '') {
      this.labelButton = 'Daftar';
      this.labelInfo = 'Konfirmasi Pendaftaran Pasien ' + this.antrianSelected.namaAsuransi;
    } else {
      if (this.klinikKonfig === 0) {
        this.labelButton = 'Konfirmasi';
        this.labelInfo = 'Konfirmasi Pendaftaran';
      } else {
        this.labelButton = 'Bayar';
        this.labelInfo = 'Pembayaran Pendaftaran';
      }
    }
  }

  onModalBayar() {  // TODO: include TarifJasaId in listAntrian
    if (this.antrianSelected) {
      this.commonSvc.httpGet(`klinik/${this.selectedKlinik}/kelaslayanan/1/jasalayananfixed/1`,
          true).pipe(takeUntil(this.destroy$))
          .subscribe((data) =>  {
            this.tarifJasaFixed = data;
            if (this.antrianSelected.namaAsuransi !== '') {
              this.onBtnOk();
            } else {
              if ( this.klinikKonfig === 0) {
                this.onBtnOk(0);
              } else {
                this.ModalPembayaran = true;
              }
            }
          });
    }
  }

  hitungKembali(v: any) {
    this.kembali = v - Number(this.tarifJasaFixed.hargaSatuan);
    this.disableButton = v < Number(this.tarifJasaFixed.hargaSatuan);
  }

  onBtnOk(config?: any) {
    this.configOk = config;

    this.commonSvc.httpGet(`pasien/${this.antrianSelected.pasienId}`,
        true).pipe(takeUntil(this.destroy$)).subscribe(psn => {
      if (psn.kategori) {
        this.saveBayarOrKonfig(config);
      } else {
        this.pasien = psn;
        this.openDlgKateg();
      }
    }, () => {
      this.commonSvc.showMessage('warn', 'Error',
          'Data pasien tidak terbaca');
    });

    /*
      const now = new Date();
      const _tanggal = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(),
        now.getMinutes(), now.getSeconds()));
    */
  }

  private saveBayarOrKonfig(config: number) {
    if (config === 0) {
      this.postBayarOrKonfirm('Pendaftaran telah dikonfirmasi');
    } else if (this.antrianSelected.namaAsuransi.toString().trim().toLowerCase() === 'bpjs') {
      const param: ConfirmDialogMsg = {
        header: 'Konfirmasi BPJS',
        message: 'Pasien akan menggunakan asuransi BPJS?<br/><br/>'
            + '<b>PERHATIAN</b>: Pelayanan asuransi BPJS masih dalam tahap uji coba.<br/>'
            + 'Saat ini tidak untuk digunakan pada operasi sesungguhnya.',
        icon: 'ui-icon-alert',
        key: 'appcfd',
        rejectVisible: false,
        accept: () => {
          this.onClickStatusBpjs(true);
        },
        reject: () => {
          this.postBayarOrKonfirm('Pendaftaran selesai');
        },
        acceptLabel: 'Ya',
        rejectLabel: 'Tidak'
      };
      this.commonSvc.confirm(param);
    } else {
      const pesanSuccess = this.antrianSelected.namaAsuransi !== '' ? 'Pasien ' +
          this.antrianSelected.namaAsuransi + ' telah didaftarkan' : ' Pendaftaran selesai';
      // pesanFailed = this.antrianSelected.namaAsuransi !== '' ? 'Daftar Pasien '
      //     + this.antrianSelected.namaAsuransi + ' Gagal' : 'Pembayaran Gagal';
      this.postBayarOrKonfirm(pesanSuccess);
    }
  }

  private postBayarOrKonfirm(pesanSuccess: string) {
    const paramBody = {
      pelayananRj: {
        statusLayanan: 1,
        konfig: this.klinikKonfig,
        klinikId: this.klinikId
      }/*,
      jasaLayananRj: {
        tarifJasaId: this.tarifJasaFixed.tarifJasaId,
        kuantitas: 1,
        waktu: new Date()
      }*/
    };

    this.commonSvc.httpPost(`transaction/pembayaran/pelayananRj/${this.antrianSelected.id}`,
        paramBody, true).pipe(takeUntil(this.destroy$))
        .subscribe(resp => {
          if (resp.ok) {
            this.antrianDisplay.noRM = '';
            this.antrianDisplay.nama = '';
            this.ModalPembayaran = false;
            const param: ConfirmDialogMsg = {
              // this.confirmationService.confirm({
              header: 'Selesai',
              message: pesanSuccess,
              icon: 'ui-icon-notice',
              key: 'appnof',
              rejectVisible: false,
              accept: () => {
                this.getAntrian();
              },
              reject: () => {},
              acceptLabel: 'OK',
              rejectLabel: 'Batal'
            };
            this.commonSvc.confirm(param);
            /*
                      this.confirmationService.confirm({
                        header: 'Selesai',
                        message : pesanSuccess,
                        icon : 'ui-icon-notice',
                        key: 'appnof',
                        rejectVisible: false,
                        accept : () => {
                          this.getAntrian();
                        }
                      });
            */
          }
        }, (/*err*/) => {
          this.ModalPembayaran = false;
          // this.globalService.showError(err);
        });
  }

  btnBatal() {
    if (this.antrianSelected?.id) {
      const param = [
        {
          op: 'replace',
          path: '/statusLayan',
          value: 4
        }
      ];

      this.commonSvc.httpPatch(`pelayananrj/${this.antrianSelected.id}`,
          param, true).pipe(takeUntil(this.destroy$))
          .subscribe((resp: any) => {
            if (resp?.ok) {
              this.commonSvc.showMessage('info', 'Info', 'Antrian Dihapus');
              this.getAntrian();
            }
          });
    } else {
      this.commonSvc.showMessage('warn', 'Info', 'Data harus dipilih');
    }
  }

  onClickPendaftaran() {
    this.router.navigate(['admin/layanan/anggota', {cd: '1'}]).then();
  }

  onClickStatusBpjs(daftar = false) {
    if (this.antrianSelected == null) {
      this.commonSvc.showMessage('warn', 'Pilih Pasien!',
          'Pasien belum dipilih');
      return;
    }
    if (this.antrianSelected.namaAsuransi != null &&
        this.antrianSelected.namaAsuransi.toString().trim().toLowerCase() === 'bpjs') {
      const params = new HttpParams().set('bpjs', 'true');

      this.commonSvc.httpGet(`asuransi/${this.antrianSelected.asuransiId}`
          + `/pasien/${this.antrianSelected.pasienId}`,
          false, params).pipe(takeUntil(this.destroy$))
          .subscribe(resp => {
            if (daftar) {
              let noAsuransi = resp.noAsuransi;
              while (noAsuransi.length < 13) {
                noAsuransi = '0' + noAsuransi;
              }
              this.daftarkanToBpjs(noAsuransi);
            } else {
              this.commonSvc.showMessage('success', 'OK',
                  'Pasien BPJS berstatus aktif');
            }
          }, () => {
          });
    } else {
      this.commonSvc.showMessage('warn', 'OK',
          'Pasien tidak terdaftar dengan BPJS');
    }
  }

  private daftarkanToBpjs(noAsuransi: any) {
    this.commonSvc.httpPost(`bpjs`, {value: `peserta/${noAsuransi}`, klinikId: this.klinikId},
        true).pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          if (data == null || data.response == null) {
            return;
          }
          console.log(data);
          if (data.response.kdProviderPst == null
              || data.response.kdProviderPst.kdProvider == null) {
            return;
          }
          // this.kodeProviderBpjs = '11021301';   // TODO: hanya Bergas, kodeProvider lain ga bisa
          if (data.response.kdProviderPst.kdProvider !== this.kodeProviderBpjs) {
            this.commonSvc.showMessage('warn', 'Error',
                'Kode Provider BPJS tidak sesuai');
            return;
          }

          const date = new Date();
          let day: string = date.getDate().toString();
          day = day.length < 2 ? '0' + day : day;
          let month: string = (date.getMonth() + 1).toString();
          month = month.length < 2 ? '0' + month : month;
          const sDate = day + '-' + month + '-' + date.getFullYear().toString();
          console.log(sDate);

          const body = {
            kdProviderPeserta: this.kodeProviderBpjs,
            tglDaftar: sDate,
            noKartu: noAsuransi,
            kdPoli: this.antrianSelected.kodePoli,
            keluhan: null,
            kunjSakit: true,
            sistole: 0,
            diastole: 0,
            beratBadan: 0,
            tinggiBadan: 0,
            respRate: 0,
            heartRate: 0,
            rujukBalik: 0,
            kdTkp: '10'
          };
          this.commonSvc.httpPost(`bpjs`,
              {value: `pendaftaran`, klinikId: this.klinikId, body: body},
              true).pipe(takeUntil(this.destroy$))
              .subscribe((data: any) => {
                if (data == null || data.response == null) {
                  return;
                }
                console.log(data);
                if (this.klinikKonfig === 0) {
                  this.postBayarOrKonfirm('Pendaftaran telah dikonfirmasi');
                } else {
                  const pesanSuccess = this.antrianSelected.namaAsuransi !== '' ? 'Pasien ' +
                      this.antrianSelected.namaAsuransi + ' telah didaftarkan' : ' Pendaftaran selesai';
                  this.postBayarOrKonfirm(pesanSuccess);
                }
              }, () => {
                this.commonSvc.showMessage('warn', 'Error',
                    'Pendaftaran BPJS tidak berhasil');
              });
        }, () => {
          this.commonSvc.showMessage('warn', 'Error',
              'Pendaftaran BPJS tidak berhasil');
        });
  }

  openDlgKateg() {
    this.dlgKategInit = {
      textLabel: 'Kategori pasien',
      selItems: [
        <SelectItem>{label: 'Siswa RA', value: 1},
        <SelectItem>{label: 'Siswa MI', value: 2},
        <SelectItem>{label: 'Siswa MTs', value: 3},
        <SelectItem>{label: 'Siswa MA', value: 4},
        <SelectItem>{label: 'Guru RA', value: 5},
        <SelectItem>{label: 'Guru MI', value: 6},
        <SelectItem>{label: 'Guru MTs', value: 7},
        <SelectItem>{label: 'Guru MA', value: 8},
        <SelectItem>{label: 'Karyawan', value: 9},
        <SelectItem>{label: 'Umum', value: 10}
      ],
      title: 'Edit Kategori Pasien',
      // seldItemVal: this.pasienSelected.kategori
    };
  }

  dlgKategClosed(dlgModel: { seldItemVal: any; }) {
    if (dlgModel && dlgModel.seldItemVal) {
      const body = Object.assign({
        anggotaId: this.pasien.anggota.id,
        klinikId: this.pasien.klinik.id
      }, this.pasien);
      body.kategori = dlgModel.seldItemVal;

      this.commonSvc.httpPut(`pasien/${this.pasien.id}`,
          body, true).pipe(takeUntil(this.destroy$))
          .subscribe((rsp: { ok: any; }) => {
            if (rsp?.ok) {
              this.saveBayarOrKonfig(this.configOk);
            }
          }, () => {
            this.commonSvc.showMessage('warn', 'Error',
                'Update kategori pasien tidak berhasil');
          });
    } else {
      this.commonSvc.showMessage('warn', 'Perhatian!',
          'Isi kategori pasien lebih dulu');
    }
  }

}
