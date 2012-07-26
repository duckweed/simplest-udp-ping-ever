package org.adscale;

import org.junit.Test;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Date;

public class AppTest {

    @Test
    public void testApp() throws Exception {
        byte[] buf = new Date().toString().getBytes();

        InetAddress address = InetAddress.getByName("localhost");
        int port = 43280;
        DatagramPacket packet = new DatagramPacket(buf, buf.length, address, port);
        new DatagramSocket().send(packet);
    }
}
