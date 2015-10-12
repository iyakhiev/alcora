package servlets;

import java.sql.*;

/**
 * Created by iyakhiev on 09.09.15.
 */
public class DB {
    public Connection connection;

    public DB() {
        try{
            Class.forName("com.mysql.jdbc.Driver").newInstance();

            try {
                connection = DriverManager.getConnection("jdbc:mysql://77.222.43.150/alcora_test", "isa", "passw0rd");
                if (connection == null) {
                    System.out.println("No connection with DB!");
                } else {
                    System.out.println("Everything is OK!");
                }
            } catch (SQLException e) {
                System.err.println("DataBase:"+ e);
            }
        }  catch(Exception e)  {
            System.err.println("Unable to load driver:"+ e);
        }
    }
}
