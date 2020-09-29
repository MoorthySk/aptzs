import axios from "../../node_modules/axios";

const INSTRUCTOR = "in28minutes";
const COURSE_API_URL = "http://localhost:8081";
const INSTRUCTOR_API_URL = `${COURSE_API_URL}/instructors/${INSTRUCTOR}`;

class CourseDataService {
  retrieveAllCourses(name) {
    //console.log('executed service')
    return axios.get(`${INSTRUCTOR_API_URL}/courses`);
  }

  retrieveCourse(name, id) {
    //console.log('executed service')
    return axios.get(`${INSTRUCTOR_API_URL}/courses/${2}`);
  }

  deleteCourse(name, id) {
    //console.log('executed service')
    return axios.delete(`${INSTRUCTOR_API_URL}/courses/${id}`);
  }

  updateCourse(name, id, course) {
    //console.log('executed service')
    return axios.put(`${INSTRUCTOR_API_URL}/courses/${id}`, course);
  }

  createCourse(name, course) {
    //console.log('executed service')
    return axios.post(`${INSTRUCTOR_API_URL}/courses/`, course);
  }
}

export default new CourseDataService();
