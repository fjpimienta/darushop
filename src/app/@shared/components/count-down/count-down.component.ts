import { Component, OnInit, Input } from '@angular/core';
import { formatDistanceToNow, addMinutes, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit {

  @Input() compact: boolean;
  @Input() format: string;
  @Input() elements = 4;
  @Input() labelsShort: boolean;
  @Input() until: string;
  @Input() wrap: string;

  cdId: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  time: number;

  constructor() {
    this.cdId = 'countd-down' + Math.ceil(Math.random() * 1000);
  }

  ngOnInit(): void {
    // Parseamos el tiempo desde el string
    this.time = parseInt(this.until, 10);

    // Convertimos el tiempo a segundos
    switch (this.until[this.until.length - 1]) {
      case 'h':
        this.time = this.time * 3600;
        break;
      case 'm':
        this.time = this.time * 60;
        break;
      case 'd':
        this.time = this.time * 3600 * 24;
        break;
      default:
        break;
    }

    this.updateTime();
  }

  updateTime() {
    const mexicoCityTimeZone = 'America/Mexico_City';

    const until: Date = parseISO(this.until);
    const now: Date = new Date();

    // Convertimos las fechas a UTC
    const untilUtc: Date = zonedTimeToUtc(until, mexicoCityTimeZone);
    const nowUtc: Date = zonedTimeToUtc(now, mexicoCityTimeZone);

    // Calculamos la diferencia
    const timeDifference = Math.floor((untilUtc.getTime() - nowUtc.getTime()) / 1000);

    // Si es un contador positivo, usar el tiempo predefinido
    if (this.until.substring(0, 1) === '+') {
      this.days = Math.floor(this.time / (3600 * 24));
      this.hours = Math.floor(this.time % (3600 * 24) / 3600);
      this.minutes = Math.floor(this.time % 3600 / 60);
      this.seconds = Math.floor(this.time % 60);
    } else {
      this.days = Math.floor(timeDifference / (3600 * 24));
      this.hours = Math.floor(timeDifference % (3600 * 24) / 3600);
      this.minutes = Math.floor(timeDifference % 3600 / 60);
      this.seconds = Math.floor(timeDifference % 60);
    }

    // Actualizar cada segundo
    if (timeDifference > 0) {
      setTimeout(() => {
        this.updateTime();
      }, 1000);
    }
  }
}
