import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = `${base_url}/api/courses`;

  private http = inject(HttpClient);

  constructor() {}

  createCourse(courseData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, courseData);
  }

   // Obtiene todos los cursos disponibles
   getCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtiene un curso por su ID
  getCourseById(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}`);
  }

  // Obtiene los videos de un curso (requiere validación del usuario)
  getCourseVideos(courseId: string, userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${courseId}/videos?userId=${userId}`);
  }

  // Verifica si el usuario ha pagado por el curso
  verifyPayment(courseId: string, userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/payments/verify?courseId=${courseId}&userId=${userId}`);
  }

  // Obtiene la lista de IDs de cursos pagados por el usuario
  getPaidCourses(userId: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/paid-courses?userId=${userId}`);
  }
}
