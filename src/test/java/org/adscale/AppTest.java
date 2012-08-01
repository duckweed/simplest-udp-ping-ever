package org.adscale;

import org.junit.Test;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Date;

public class AppTest {

    @Test
    public void testApp() throws Exception {
        String message = "\");  delete from fitnesse_test; " + new Date();
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
