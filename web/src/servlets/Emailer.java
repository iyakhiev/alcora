package servlets;

import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;
import java.util.*;

/**
 * Created by iyakhiev on 09.09.15.
 */
public class Emailer extends HttpServlet {
    static final String mailUsername = "isa.yahiev@gmail.com";
    static final String mailPassword = "03ch01me93go";
    static final char[] letters = new char[]{'�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�'};
    static final String[] codes = new String[]{"&#1040;","&#1041;","&#1042;","&#1043;","&#1044;","&#1045;","&#1046;","&#1047;","&#1048;","&#1049;","&#1050;","&#1051;","&#1052;","&#1053;","&#1054;","&#1055;","&#1056;","&#1057;","&#1058;","&#1059;","&#1060;","&#1061;","&#1062;","&#1063;","&#1064;","&#1065;","&#1066;","&#1067;","&#1068;","&#1069;","&#1070;","&#1071;","&#1072;","&#1073;","&#1074;","&#1075;","&#1076;","&#1077;","&#1078;","&#1079;","&#1080;","&#1081;","&#1082;","&#1083;","&#1084;","&#1085;","&#1086;","&#1087;","&#1088;","&#1089;","&#1090;","&#1091;","&#1092;","&#1093;","&#1094;","&#1095;","&#1096;","&#1097;","&#1098;","&#1099;","&#1100;","&#1101;","&#1102;","&#1103;"};
    static Properties props;

    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        try {
            res.setContentType("application/json");
            PrintWriter out = res.getWriter();
            String mail = req.getParameter("mail"),
                    content = req.getParameter("content"),
                    contentType = req.getParameter("contentType"),
                    subject = req.getParameter("subject");

            out.println("{ \"status\": \"" + send(mail, content, contentType, subject) + "\" }");
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String encode(String text) {
        String newText = "";
        for(int i = 0; i < text.length(); i++) {
            char letter = text.charAt(i);
            int ind = Arrays.asList(letters).indexOf(letter);
            newText += ind > -1 ? codes[ind] : letter;
        }

        return newText;
    }

    public static String send(String mail, String content, String contentType, String subject) {
        props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication(){
                        return new PasswordAuthentication (mailUsername, mailPassword);
                    }
                });

        String status = "KO!";
        try{
            System.out.println("start sending");
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(mailUsername));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(mail));
            message.setSubject(subject);
            System.out.println("set content");
            message.setContent(content, contentType);
            Transport.send(message);
            System.out.println("mail wass sent");
            status = "OK!";
        } catch (AddressException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return status;
    }
}
