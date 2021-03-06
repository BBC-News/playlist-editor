import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Clip } from '../clip';
import { ClipsService } from '../clips.service';
import { Broadcast } from '../broadcast';
import { ScheduleComponent } from '../schedule/schedule.component';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-clips',
  templateUrl: './clips.component.html',
  styleUrls: ['./clips.component.css']
})
export class ClipsComponent implements OnInit {
  @Output() scheduleChange = new EventEmitter();
  dataSource: MatTableDataSource<Clip>;
  displayedColumns = ['title', 'duration', 'updated_time', 'actions'];

  constructor(private service: ClipsService) { }

  ngOnInit() {
    this.showClips();
  }

  showClips() {
    this.service.getClips()
      .subscribe(data => {
        data.forEach(datum => datum['use'] = 'unused');
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.filter = 'unused';
      });
  }

  getClip(pid: string): Clip {
    return this.dataSource.data.find(function(element) {
      return element.pid === pid;
    });
  }

  onAdd(event: any) {
    const pid = event.path[0].value;
    const clip: Clip = this.getClip(pid);
    const b: Broadcast = new Broadcast(pid, '', clip.duration, true);
    this.scheduleChange.emit(b);
    const data = this.dataSource.data;
    data.forEach(element => {
      if (element.pid === pid) {
        element['use'] = 'used';
      }
    });
    this.dataSource.data = data;
  }
}
