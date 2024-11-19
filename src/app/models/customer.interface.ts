export interface CustomerInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  enabled: boolean;
  accountNotExpired?: boolean;
  accountNotLocked?: boolean;
  credentialNotExpired?: boolean;
  createdAt?: string;
  updatedAt?: string;
  paymentMethodId?: string;

  // Añadimos la propiedad customerCourses que contiene una lista de cursos
  customerCourses?: {
    course: {
      id: string;
      title: string;
      description: string;
      price: number;
      imagePath: string;
      videoPaths: string[];
      pdfPaths: string[];
      status: string;
    };
    paymentStatus: boolean;
  }[];
}

