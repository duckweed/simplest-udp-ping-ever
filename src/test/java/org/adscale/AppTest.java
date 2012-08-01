package org.adscale;

import org.junit.Test;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Date;
import java.util.HashMap;

public class AppTest {

    @Test
    public void testApp() throws Exception {

        String message = "{";

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("id", 1);
        map.put("test_name", "somename");
        map.put("run_time_in_millis", 1112000);
        map.put("run_date", new Date());
        map.put("status", "PASS");
        map.put("host", "imac33");
        map.put("ip_address", "192.168.1.1");
        map.put("branch", "VE-Thing");
        map.put("sha", "2994a51f95189688fcef43d7d872edd449669717");
        map.put("run", "123");

        for (String key : map.keySet()) {
            Object value = map.get(key);
            message += "\"" + key + "\":\"" + value + "\", ";
        }

        message = message.substring(0, message.length() - 2);

        message += "}";

        System.out.println("message = " + message);



//        String message = "{\"msg\": \"hello\"}";


        byte[] buf = message.toString().getBytes();

        DatagramSocket socket = null;
        try {
            InetAddress address = InetAddress.getByName("127.0.0.1");
            int port = 42830;
            DatagramPacket packet = new DatagramPacket(buf, buf.length, address, port);
            socket = new DatagramSocket(port);
            socket.send(packet);
        }
        finally {
            socket.disconnect();
            socket.close();
        }
    }
}
