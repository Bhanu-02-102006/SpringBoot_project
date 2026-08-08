package com.employee.repository;

import com.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    List<Employee> findByNameContainingIgnoreCase(String name);
    boolean existsByEmail(String email);
    Optional<Employee> findByEmail(String email);

    @Query("select count(distinct e.department) from Employee e")
    long countDistinctDepartments();

    @Query("select avg(e.salary) from Employee e")
    Double getAverageSalary();

    @Query("select max(e.salary) from Employee e")
    Double getHighestSalary();

    @Query("select e.department, count(e) from Employee e group by e.department")
    List<Object[]> getDepartmentCountGrouped();

    List<Employee> findTop5ByOrderByIdDesc();
}