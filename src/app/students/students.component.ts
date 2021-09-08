import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Students {
  name: string;
  mark1: number;
  mark2: number;
  mark3: number;
  total: number;
  rank: number;
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'name',
    'mark1',
    'mark2',
    'mark3',
    'total',
    'rank',
  ];
  dataSource = new MatTableDataSource<Students>();
  loader = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    /* get student list */
    this.loader = true;
    this.http
      .get('assets/students.mockData.json')
      .subscribe((res: Students[]) => {
        // order by students based on the total
        res.sort((a, b) => {
          return b.total - a.total;
        });

        this.dataSource.data = [...this.dataSource.data, ...res];
        this.loader = false;
      });
  }

  addStudent(): void {
    const newStd: Students[] = [];
    newStd.push({
      name: 'enter student name',
      mark1: 0,
      mark2: 0,
      mark3: 0,
      total: 0,
      rank: 0,
    });
    this.dataSource.data = [...this.dataSource.data, ...newStd];
  }

  validateTotal(event: any, index: number): void {
    const key = event.target.name;
    this.dataSource.data[index][key] = Number(this.dataSource.data[index][key]);
    this.dataSource.data[index].total =
      this.dataSource.data[index].mark1 +
      this.dataSource.data[index].mark2 +
      this.dataSource.data[index].mark3;

    setTimeout(() => {
      const result = this.dataSource.data.sort((a, b) => {
        return b.total - a.total;
      });
      this.dataSource.data = [...result];
    }, 1500);
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = event.key;
    const regex = new RegExp(/[0-9]|,/);
    return regex.test(charCode);
  }
}
